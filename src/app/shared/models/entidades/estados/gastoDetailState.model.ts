import { Gasto } from "../gasto.model";
import { ResponseData } from '../responseData.model';
import { Cuenta } from "../cuenta.model";
import { Persona } from "../persona.model";
import { FormaPago } from "../formaPago.model";
import { Concepto } from "../concepto.model";
import { Proveedor } from "../proveedor.model";

export interface GastoDetailState{
    loading: boolean;
    errorCarga: boolean;
    gastoPorId: Gasto | null;
    errorMessage: string;
    cuentas: ResponseData<Cuenta> | null;
    personas: ResponseData<Persona> | null;
    formasPago: ResponseData<FormaPago> | null;
    proveedores: ResponseData<Proveedor> | null;
    conceptos: ResponseData<Concepto> | null;
}