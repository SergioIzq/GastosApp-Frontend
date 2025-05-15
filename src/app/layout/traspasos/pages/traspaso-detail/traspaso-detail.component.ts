import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, takeUntil, filter, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, ActionsSubject } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as TraspasoDetailActions from '../../ngrx/actions/traspaso-detail.actions';
import * as TraspasoSelector from '../../ngrx/selectors/traspaso-detail.selectors';
import { Location } from '@angular/common';
import { Cuenta } from 'src/app/shared/models/entidades/cuenta.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Traspaso } from 'src/app/shared/models/entidades/traspaso.model';
import { selectUsuarioPorId } from 'src/app/shared/menu/ngrx/selectors/menu.selectors';
import { Usuario } from 'src/app/shared/models/entidades/usuario.model';
import { minAmountValidator } from 'src/app/shared/models/entidades/minAmountValidator.model';
import { TraspasoDetailState } from 'src/app/shared/models/entidades/estados/traspasoDetail.model';
import { MenuState } from 'src/app/shared/models/entidades/estados/menustate.model';
import { TraspasoByIdRespuesta } from 'src/app/shared/models/entidades/respuestas/traspasos/traspasoByIdRespuesta.model';

@Component({
  selector: 'app-traspaso-detail',
  templateUrl: './traspaso-detail.component.html',
  styleUrls: ['./traspaso-detail.component.css']
})
export class TraspasoDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  loading: boolean = false;
  error$!: Observable<boolean>;
  newTraspasoForm!: FormGroup;
  detailTraspasoForm!: FormGroup;
  cuentas$!: Observable<Cuenta[] | null>;
  cuentas!: Cuenta[];
  traspasoId: number = 0;
  traspasoPorId$!: Observable<TraspasoByIdRespuesta | null>;
  originalTraspasoData!: Traspaso;
  isNewTraspaso: boolean = false;
  filteredCuentasDestinos: Cuenta[] = [];
  filteredCuentasOrigen: Cuenta[] = [];
  usuario!: Usuario;
  deshabilitarBoton: boolean = false;
  private _confirmationService: ConfirmationService = inject(ConfirmationService);

  constructor(
    private store: Store<TraspasoDetailState>,
    private _store: Store<MenuState>,
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
      Importe: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Fecha: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(100)]],
    });
    this.detailTraspasoForm = this.fb.group({
      Id: [''],
      IdUsuario: [''],
      CuentaOrigen: ['', [Validators.required]],
      CuentaDestino: ['', [Validators.required]],
      Importe: ['', [Validators.required, Validators.pattern(/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/), minAmountValidator]],
      Fecha: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {

    this.actionsSubject.pipe(filter(action => action.type === 'GetNewTraspasoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (action) {          
          this.cuentas = [...action.payload];
          this.filteredCuentasDestinos = this.cuentas.slice().sort((a, b) => a.Nombre.localeCompare(b.Nombre));
          this.filteredCuentasOrigen = this.cuentas.slice().sort((a, b) => a.Nombre.localeCompare(b.Nombre));

          if (!this.isNewTraspaso) {
            this.filterInitialCuentas();
          }          
        }
      })

    this._store.select(selectUsuarioPorId).pipe(takeUntil(this.destroy$)).subscribe((usuario: any) => {
      if (usuario) {

        this.usuario = usuario;
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
          this.newTraspasoForm.patchValue({
            Fecha: new Date().toLocaleDateString('es-ES')
          });

          this.store.dispatch(TraspasoDetailActions.GetNewTraspaso({ payload: this.usuario.Id }));
        } else {
          this.store.dispatch(TraspasoDetailActions.GetTraspaso({ id: id }));
          this.traspasoPorId$ = this.store.select(TraspasoSelector.selectedTraspasoSelector);
        }
      }
    });

    this.traspasoPorId$ = this.store.select(TraspasoSelector.selectedTraspasoSelector);


    this.store.select(TraspasoSelector.selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.error$ = this.store.select(TraspasoSelector.selectErrorCarga);

    this.actionsSubject.pipe(filter(action => action.type === 'RealizarTraspasoSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (this.usuario.Id) {
          this.router.navigate(['traspasos/traspaso-detail', action.traspaso.Item.Id]);
          this.isNewTraspaso = false;
          this.store.dispatch(TraspasoDetailActions.GetNewTraspaso({ payload: this.usuario.Id }));

          this.filterCuentasOrigen(action.traspaso.Item?.CuentaDestino);
          this.filterCuentasDestinos(action.traspaso.Item?.CuentaOrigen);
        }
      });


    this.traspasoPorId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((traspasoRespuesta: TraspasoByIdRespuesta | null) => {
        if (traspasoRespuesta) {
          let traspaso = traspasoRespuesta.TraspasoById;
          this.cuentas = traspasoRespuesta.ListaCuentas;
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

    let fechaLocal = formValue.Fecha;


    if (typeof fechaLocal === 'string' && fechaLocal.includes('/')) {
      const [day, month, year] = fechaLocal.split('/').map(Number);
      fechaLocal = new Date(year, month - 1, day);
    }

    const fechaUTC = new Date(fechaLocal.getTime() - fechaLocal.getTimezoneOffset() * 60000).toISOString();

    const formattedFormValue = {
      ...formValue,
      Importe: importe,
      Fecha: fechaUTC
    };

    if (this.isNewTraspaso) {
      this.showConfirmation('create', formattedFormValue);
    } else {
      this.showConfirmation('edit', formattedFormValue);
    }
  }

    private showConfirmation(actionType: string, formValue: any) {
      const headerMessage = actionType === 'create' ? 'Confirmar creación' : 'Confirmar edición';
      const detailMessage = actionType === 'create'
        ? '¿Está seguro que desea crear este registro?'
        : '¿Está seguro que desea editar este registro?';
  
      this._confirmationService.confirm({
        message: detailMessage,
        header: headerMessage,
        icon: 'pi pi-info-circle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          // Acción confirmada, proceder con el envío del formulario
          if (actionType === 'create') {
            this.createTraspaso(formValue);
          } else {
            this.updateTraspaso(formValue);
          }
        }
      });
    }
  
    private createTraspaso(formattedFormValue: any) {
      const newTraspasoData = { ...formattedFormValue };
      this.store.dispatch(TraspasoDetailActions.RealizarTraspaso({ payload: newTraspasoData }));
      this.deshabilitarBoton = true;
    }
  
    private updateTraspaso(formattedFormValue: any) {
      const updatedTraspasoData = { ...formattedFormValue };
      updatedTraspasoData.Id = this.traspasoId;
      this.store.dispatch(TraspasoDetailActions.UpdateTraspaso({ traspaso: updatedTraspasoData }));
      this.detailTraspasoForm.markAsPristine();
      this.deshabilitarBoton = true;
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
      this.filteredCuentasDestinos = this.cuentas;
    }
  }

  onCuentaDestinoChange(event: any): void {
    const cuentaDestino = event.value;

    if (cuentaDestino) {
      this.filterCuentasOrigen(cuentaDestino);
    } else {
      this.filteredCuentasOrigen = this.cuentas;
    }

  }

  private filterCuentasDestinos(cuentaOrigen: Cuenta): void {
    if (this.cuentas) {
      this.filteredCuentasDestinos = this.cuentas
        .filter(cuenta => cuenta.Id !== cuentaOrigen.Id)
        .sort((a, b) => a.Nombre.localeCompare(b.Nombre)); // Ordena alfabéticamente por 'Nombre'
    }
  }

  private filterCuentasOrigen(cuentaDestino: Cuenta): void {
    if (this.cuentas) {
      this.filteredCuentasOrigen = this.cuentas
        .filter(cuenta => cuenta.Id !== cuentaDestino.Id)
        .sort((a, b) => a.Nombre.localeCompare(b.Nombre)); // Ordena alfabéticamente por 'Nombre'
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
