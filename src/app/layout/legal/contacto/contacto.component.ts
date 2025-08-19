import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { EnviarFormContacto } from './ngrx/contacto.actions';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  fb: FormBuilder = inject(FormBuilder);
  store: Store = inject(Store)
  contactoForm!: FormGroup;
  deshabilitarBoton: boolean = false;

  constructor() {
    this.contactoForm = this.fb.group({
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
      Email: ['', [Validators.required, Validators.maxLength(100)]],
      Mensaje: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.contactoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.deshabilitarBoton = false;
    });
  }

  onSubmit(form: any) {
    if (form.valid) {
      const contactoFormData = form.value;
      this.store.dispatch(EnviarFormContacto({ form: contactoFormData }));
      this.deshabilitarBoton = true;
    }
  }

}