import { ActionReducerMap } from "@ngrx/store";
import { categoriasListReducer } from "./layout/categorias/ngrx/reducer/categorias-list.reducer";
import { CategoriaDetailReducer } from './layout/categorias/ngrx/reducer/categoria-detail.reducer';
import { ingresosListReducer } from "./layout/ingresos/ngrx/reducer/ingresos-list.reducer";
import { IngresoDetailReducer } from "./layout/ingresos/ngrx/reducer/ingreso-detail.reducer";
import { gastosListReducer } from "./layout/gastos/ngrx/reducer/gastos-list.reducer";
import { GastoDetailReducer } from "./layout/gastos/ngrx/reducer/gasto-detail.reducer";
import { MenuState } from "./shared/models/entidades/estados/menustate.model";
import { MenuReducer } from "./shared/menu/ngrx/reducer/menu.reducer";
import { EntidadListState } from "./shared/models/entidades/estados/entidadListState.model";
import { Categoria } from "./shared/models/entidades/categoria.model";
import { CategoriaDetailState } from "./shared/models/entidades/estados/categoriaDetail.model";
import { Ingreso } from "./shared/models/entidades/ingreso.model";
import { Gasto } from "./shared/models/entidades/gasto.model";
import { IngresoDetailState } from './shared/models/entidades/estados/ingresoDetailState.model';
import { GastoDetailState } from './shared/models/entidades/estados/gastoDetailState.model';
import { Resumen } from "./shared/models/entidades/resumen.model";
import { resumenListReducer } from "./layout/resumen/ngrx/reducers/resumen-list.reducer";
import { ResumenListState } from "./shared/models/entidades/estados/resumenListState.model";
import { ConceptoDetailState } from "./shared/models/entidades/estados/conceptoDetail.model";
import { ConceptoDetailReducer } from "./layout/conceptos/ngrx/reducers/concepto-detail.reducer";
import { conceptosListReducer } from "./layout/conceptos/ngrx/reducers/conceptos-list.reducer";
import { Concepto } from "./shared/models/entidades/concepto.model";
import { Persona } from "./shared/models/entidades/persona.model";
import { PersonaDetailState } from "./shared/models/entidades/estados/personaDetail.model";
import { personasListReducer } from "./layout/personas/ngrx/reducers/personas-list.reducer";
import { PersonaDetailReducer } from "./layout/personas/ngrx/reducers/persona-detail.reducer";
import { ClienteDetailState } from "./shared/models/entidades/estados/clienteDetail.model";
import { Cliente } from "./shared/models/entidades/cliente.model";
import { clientesListReducer } from "./layout/clientes/ngrx/reducers/clientes-list.reducer";
import { ClienteDetailReducer } from "./layout/clientes/ngrx/reducers/cliente-detail.reducer";
import { Proveedor } from "./shared/models/entidades/proveedor.model";
import { ProveedorDetailState } from "./shared/models/entidades/estados/proveedorDetailState.model";
import { ProveedorDetailReducer } from "./layout/proveedores/ngrx/reducers/proveedor-detail.reducer";
import { proveedoresListReducer } from "./layout/proveedores/ngrx/reducers/proveedores-list.reducer";
import { Cuenta } from "./shared/models/entidades/cuenta.model";
import { CuentaDetailState } from "./shared/models/entidades/estados/cuentaDetailState.model";
import { cuentasListReducer } from "./layout/cuentas/ngrx/reducers/cuentas-list.reducer";
import { CuentaDetailReducer } from "./layout/cuentas/ngrx/reducers/cuenta-detail.reducer";
import { TraspasoDetailState } from "./shared/models/entidades/estados/traspasoDetail.model";
import { TraspasoDetailReducer } from "./layout/traspasos/ngrx/reducers/traspaso-detail.reducer";
import { Traspaso } from "./shared/models/entidades/traspaso.model";
import { traspasosListReducer } from "./layout/traspasos/ngrx/reducers/traspasos-list.reducer";
import { FormaPago } from "./shared/models/entidades/formaPago.model";
import { FormaPagoDetailReducer } from "./layout/formas-pago/ngrx/reducers/forma-pago-detail.reducer";
import { formasPagoListReducer } from "./layout/formas-pago/ngrx/reducers/formas-pago-list.reducer";
import { FormaPagoDetailState } from "./shared/models/entidades/estados/formaPagoDetailState.model";
import { AuthState } from "./shared/models/entidades/estados/authState.model";
import { AuthReducer } from "./shared/auth/ngrx/auth.reducer";
import { UsuarioDetailState } from "./shared/models/entidades/estados/usuarioDetailState.model";
import { UsuarioDetailReducer } from "./layout/usuario/ngrx/usuario-detail.reducer";

export interface AppState {
    listaCategorias: EntidadListState<Categoria>;
    categoriaPorId: CategoriaDetailState;
    ingresos: EntidadListState<Ingreso>;
    ingresoPorId: IngresoDetailState;
    menu: MenuState,
    listaGastos: EntidadListState<Gasto>,
    gastoPorId: GastoDetailState,
    listaConceptos: EntidadListState<Concepto>,
    conceptoPorId: ConceptoDetailState,
    resumen: ResumenListState,
    listaPersonas: EntidadListState<Persona>,
    personaPorId: PersonaDetailState
    listaClientes: EntidadListState<Cliente>,
    clientePorId: ClienteDetailState,
    listaProveedores: EntidadListState<Proveedor>,
    proveedorPorId: ProveedorDetailState,
    listaCuentas: EntidadListState<Cuenta>,
    cuentaPorId: CuentaDetailState,
    listaTraspasos: EntidadListState<Traspaso>,
    traspaso: TraspasoDetailState,
    listaFormasPago: EntidadListState<FormaPago>,
    formaPago: FormaPagoDetailState,
    auth: AuthState,
    usuario: UsuarioDetailState
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
    listaCategorias: categoriasListReducer,
    categoriaPorId: CategoriaDetailReducer,
    ingresos: ingresosListReducer,
    ingresoPorId: IngresoDetailReducer,
    menu: MenuReducer,
    listaGastos: gastosListReducer,
    gastoPorId: GastoDetailReducer,
    resumen: resumenListReducer,
    listaConceptos: conceptosListReducer,
    conceptoPorId: ConceptoDetailReducer,
    listaPersonas: personasListReducer,
    personaPorId: PersonaDetailReducer,
    listaClientes: clientesListReducer,
    clientePorId: ClienteDetailReducer,
    listaProveedores: proveedoresListReducer,
    proveedorPorId: ProveedorDetailReducer,
    listaCuentas: cuentasListReducer,
    cuentaPorId: CuentaDetailReducer,
    listaTraspasos: traspasosListReducer,
    traspaso: TraspasoDetailReducer,
    listaFormasPago: formasPagoListReducer,
    formaPago: FormaPagoDetailReducer,
    auth: AuthReducer,
    usuario: UsuarioDetailReducer
}