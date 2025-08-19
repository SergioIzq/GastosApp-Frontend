import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ContactoFormRequest } from 'src/app/shared/models/entidades/requests/contactoFormRequest.model';

export const EnviarFormContacto = createAction('EnviarFormContacto', props<{ form: ContactoFormRequest }>());

export const EnviarFormContactoFailure = createAction('EnviarFormContactoFailure', props<{ errorMessage: Observable<never> }>());

export const EnviarFormContactoSuccess = createAction('EnviarFormContactoSuccess', props<{ successMessage: string }>());