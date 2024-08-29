import { Usuario } from "../usuario.model";

export interface MenuState {
    usuarioPorId: Usuario | null;
    loading: boolean;
}

