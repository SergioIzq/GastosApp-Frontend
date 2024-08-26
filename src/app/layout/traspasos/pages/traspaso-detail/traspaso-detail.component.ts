import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, filter, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, ActionsSubject } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as TraspasoDetailActions from '../../ngrx/actions/traspaso-detail.actions';
import * as TraspasoSelector from '../../ngrx/selectors/traspaso-detail.selectors';
import { Location } from '@angular/common';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { ResponseData } from 'src/app/shared/models/entidades/responseData.model';
import { MessageService } from 'primeng/api';
import { Traspaso } from 'src/app/shared/models/entidades/traspaso.model';
import { selectUserId } from 'src/app/shared/auth/ngrx/auth.selectors';
import { selectUsuarioPorId } from 'src/app/shared/menu/ngrx/selectors/menu.selectors';
import { Usuario } from 'src/app/shared/models/entidades/usuario.model';

@Component({
  selector: 'app-traspaso-detail',
  templateUrl: './traspaso-detail.component.html',
  styleUrls: ['./traspaso-detail.component.css']
})
export class TraspasoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  cargando$!: Observable<boolean>;
  error$!: Observable<boolean>;
  newTraspasoForm!: FormGroup;
  detailTraspasoForm!: FormGroup;
  cuentas$!: Observable<ResponseData<Cuenta> | null>;
  cuentas!: ResponseData<Cuenta>;
  traspasoId: number = 0;
  traspasoPorId$!: Observable<Traspaso | null>;
  originalTraspasoData!: Traspaso;
  isNewTraspaso: boolean = false;
  filteredCuentasDestinos: Cuenta[] = [];
  filteredCuentasOrigen: Cuenta[] = [];
  usuario!: Usuario;
  deshabilitarBoton: boolean = false;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private actionsSubject: ActionsSubject,
    private messageService: MessageService
  ) {
    this.newTraspasoForm = this.fb.group({
      IdUsuario: [''],
      CuentaOrigen: ['', [Validators.required]],
      CuentaDestino: ['', [Validators.required]],
      Importe: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), Validators.min(0.01)]],
      Fecha: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(100)]],
    });
    this.detailTraspasoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      CuentaOrigen: ['', [Validators.required]],
      CuentaDestino: ['', [Validators.required]],
      Importe: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), Validators.min(0.01)]],
      Fecha: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {

    this.store.select(selectUsuarioPorId).pipe(takeUntil(this.destroy$)).subscribe((usuario: any) => {
      if (usuario) {

        this.usuario = usuario;
        this.store.dispatch(TraspasoDetailActions.GetCuentas({ id: this.usuario.Id }));
        this.cuentas$ = this.store.select(TraspasoSelector.selectCuentas);

        this.cuentas$
          .pipe(takeUntil(this.destroy$))
          .subscribe((cuentas: ResponseData<Cuenta> | null) => {
            if (cuentas) {
              this.cuentas = cuentas;
              this.filteredCuentasDestinos = cuentas.Items;
              this.filteredCuentasOrigen = cuentas.Items;

              if (!this.isNewTraspaso) {
                this.filterInitialCuentas();
              }
            }
          });
      }
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        const id = parseInt(idString, 10);
        this.traspasoId = id;
        if (id === 0) {
          this.isNewTraspaso = true;
          this.traspasoPorId$ = of(null);
        } else {
          this.store.dispatch(TraspasoDetailActions.GetTraspaso({ id: id }));
          this.traspasoPorId$ = this.store.select(TraspasoSelector.selectedTraspasoSelector);
        }
      } else {
        console.error('No hay id por parámetro');
      }
    });

    this.traspasoPorId$ = this.store.select(TraspasoSelector.selectedTraspasoSelector);


    this.cargando$ = this.store.select(TraspasoSelector.selectCargando);
    this.error$ = this.store.select(TraspasoSelector.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'RealizarTraspasoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (this.usuario.Id) {
          this.router.navigate(['traspasos/traspaso-detail', action.traspaso.Item.Id]);
          this.isNewTraspaso = false;
          this.store.dispatch(TraspasoDetailActions.GetCuentas({ id: this.usuario.Id }));

          this.filterCuentasOrigen(action.traspaso.Item?.CuentaDestino);
          this.filterCuentasDestinos(action.traspaso.Item?.CuentaOrigen);
        }
      });


    this.traspasoPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((traspaso: Traspaso | null) => {
        if (traspaso) {
          const fechaUTC = new Date(traspaso.Fecha);
          const fechaLocal = new Date(fechaUTC.getTime() - fechaUTC.getTimezoneOffset() * 60000);

          this.detailTraspasoForm.patchValue({
            ...traspaso,
            Importe: this.replaceDotsWithCommas(traspaso.Importe),
            Fecha: fechaLocal,
          });

          this.originalTraspasoData = { ...traspaso };

          this.onCuentaOrigenChange({ value: traspaso.CuentaOrigen });
          this.onCuentaDestinoChange({ value: traspaso.CuentaDestino });
        }
      });

    this.detailTraspasoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });

    this.newTraspasoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    const formValue = this.isNewTraspaso ? this.newTraspasoForm.value : this.detailTraspasoForm.value;
    formValue.IdUsuario = this.usuario.Id;
    const importe = this.replaceCommasWithDots(formValue.Importe);

    const fechaLocal = new Date(formValue.Fecha);
    const fechaUTC = new Date(fechaLocal.getTime() - fechaLocal.getTimezoneOffset() * 60000).toISOString();

    const formattedFormValue = {
      ...formValue,
      Importe: importe,
      Fecha: fechaUTC
    };

    if (this.isNewTraspaso) {
      const newTraspasoData = { ...formattedFormValue };
      this.store.dispatch(TraspasoDetailActions.RealizarTraspaso({ payload: newTraspasoData }));
      this.deshabilitarBoton = true;
    } else {
      const updatedTraspasoData = { ...formattedFormValue };
      updatedTraspasoData.Id = this.originalTraspasoData.Id;
      this.store.dispatch(TraspasoDetailActions.UpdateTraspaso({ traspaso: updatedTraspasoData }));
      this.detailTraspasoForm.markAsPristine();
      this.deshabilitarBoton = true;
    }
  }

  private replaceCommasWithDots(value: any): any {
    if (typeof value === 'string') {
      value = value.replace(/,/g, '.');
      return value.replace(/\.(?=.*\.)/g, '');
    }
    return value;
  }

  goBack(): void {
    this.router.navigate(['traspasos/traspasos-list']);
  }

  onCuentaOrigenChange(event: any): void {
    const cuentaOrigen = event.value;
    if (cuentaOrigen) {
      this.filterCuentasDestinos(cuentaOrigen);
    } else {
      this.filteredCuentasDestinos = this.cuentas.Items;
    }
  }

  onCuentaDestinoChange(event: any): void {
    const cuentaDestino = event.value;

    if (cuentaDestino) {
      this.filterCuentasOrigen(cuentaDestino);
    } else {
      this.filteredCuentasOrigen = this.cuentas.Items;
    }

  }


  private filterCuentasDestinos(cuentaOrigen: Cuenta): void {
    if (this.cuentas) {
      this.filteredCuentasDestinos = this.cuentas.Items.filter(cuenta => cuenta.Id !== cuentaOrigen.Id);
    }
  }

  private filterCuentasOrigen(cuentaDestino: Cuenta): void {
    if (this.cuentas) {
      this.filteredCuentasOrigen = this.cuentas.Items.filter(cuenta => cuenta.Id !== cuentaDestino.Id);
    }
  }

  private filterInitialCuentas(): void {
    const cuentaOrigen = this.detailTraspasoForm.get('CuentaOrigen')?.value;
    const cuentaDestino = this.detailTraspasoForm.get('CuentaDestino')?.value;

    if (cuentaOrigen) {
      this.filterCuentasDestinos(cuentaOrigen);
    }

    if (cuentaDestino) {
      this.filterCuentasOrigen(cuentaDestino);
    }

  }

  private isValidTraspaso(importe: number, cuentaOrigenId: number): boolean {
    const cuentaOrigen = this.cuentas.Items.find(cuenta => cuenta.Id === cuentaOrigenId);
    return cuentaOrigen ? cuentaOrigen.Saldo >= importe : false;
  }

  private replaceDotsWithCommas(value: any): any {
    // Convertimos el valor a cadena
    let stringValue = value.toString();

    // Primero, eliminamos todos los puntos excepto el último
    stringValue = stringValue.replace(/\.(?=.*\.)/g, '');

    // Luego, reemplazamos el último punto por una coma
    stringValue = stringValue.replace(/\./g, ',');

    return stringValue;
  }
}
