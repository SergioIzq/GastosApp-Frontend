import { Ingreso } from "../ingreso.model";
import { ResponseOne } from "../responseOne.model";
import { ResponseData } from '../responseData.model';
import { Cuenta } from "../cuenta.model";
import { Persona } from "../persona.model";
import { FormaPago } from "../formaPago.model";
import { Cliente } from "../cliente.model";
import { Concepto } from "../concepto.model";

export interface IngresoDetailState {
    cargando: boolean;
    errorCarga: boolean;
    ingresoPorId: Ingreso | null;
    errorMessage: string;
    cuentas: ResponseData<Cuenta> | null;
    personas: ResponseData<Persona> | null;
    formasPago: ResponseData<FormaPago> | null;
    clientes: ResponseData<Cliente> | null;
    conceptos: ResponseData<Concepto> | null;
}