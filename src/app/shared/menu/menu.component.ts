import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { selectIsAuthenticated, selectUserId } from '../auth/ngrx/auth.selectors';
import * as MenuActions from '../menu/ngrx/actions/menu.actions';
import * as AuthActions from '../auth/ngrx/auth.actions';
import { AppState } from 'src/app/app.state';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { filter, takeUntil } from 'rxjs/operators';
import { selectLoading, selectUsuarioPorId } from './ngrx/selectors/menu.selectors';
import { Usuario } from '../models/entidades/usuario.model';
import { MenuState } from '../models/entidades/estados/menustate.model';
import { AuthState } from '../models/entidades/estados/authState.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();
  isDarkMode: boolean = false;
  isSidebarOpen$!: Observable<boolean>;
  items!: MenuItem[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  usuario!: Usuario | null;
  idUsuario!: number;
  dirPath!: any;
  loading: boolean = false;

  constructor(
    private store: Store<MenuState>,
    private _store: Store<AuthState>,
    private actionsSubject: ActionsSubject,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this._store.select(selectUserId).subscribe((idUsuario: number) => {
      if (idUsuario) {
        this.idUsuario = idUsuario;
        this.store.dispatch(MenuActions.GetUsuario({ id: this.idUsuario }));
      }
    });

    this.store.select(selectUsuarioPorId).subscribe((usuario: Usuario | null) => {
      this.usuario = usuario;
    });

    this._store.select(selectIsAuthenticated).pipe(takeUntil(this.destroy$)).subscribe(isAuthenticated => {
      this.items = isAuthenticated ? this.getAuthenticatedMenuItems() : this.getUnauthenticatedMenuItems();
    });

    this.store.select(selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.loading = loading;
    });

    this.actionsSubject.pipe(filter(action => action.type === '[Auth] Logout'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.messageService.add({ severity: 'info', summary: 'Operación exitosa', detail: 'Cerrando sesión', life: 5000 });
      });

    this.actionsSubject.pipe(filter(action => action.type === 'DeleteUsuarioSuccess'), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Usuario eliminado correctamente', life: 5000 });
        this.logout();
      });

    // Recuperar el modo guardado en localStorage
    const savedMode = localStorage.getItem('selectedMode');
    this.isDarkMode = savedMode === 'night';
    this.isDarkModeSubject.next(this.isDarkMode);

    // Suscribirse a los cambios en el estado del modo
    this.isDarkMode$.subscribe(isDark => {
      this.applyMode(isDark);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getAuthenticatedMenuItems(): MenuItem[] {
    return [
      { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: '/home' },
      { label: 'Mi perfil', icon: 'pi pi-fw pi-user-edit', routerLink: `/usuario/usuario-detail${this.idUsuario}` },
      {
        label: 'Operaciones',
        icon: 'pi pi-calculator',
        items: [
          { label: 'Ingresos', icon: 'pi pi-fw pi-euro', routerLink: '/ingresos/ingresos-list' },
          { label: 'Gastos', icon: 'pi pi-fw pi-wallet', routerLink: '/gastos/gastos-list' },
          { label: 'Traspaso', icon: 'fas fa-exchange', routerLink: '/traspasos/traspasos-list' }
        ]
      },
      {
        label: 'Gestión de Categorías',
        icon: 'pi pi-tag',
        items: [
          { label: 'Categorías', icon: 'pi pi-fw pi-tag', routerLink: '/categorias/categorias-list' },
          { label: 'Conceptos', icon: 'pi pi-fw pi-list', routerLink: '/conceptos/conceptos-list' },
          { label: 'Personas', icon: 'pi pi-fw pi-users', routerLink: '/personas/personas-list' },
          { label: 'Formas de pago', icon: 'pi pi-fw pi-credit-card', routerLink: '/formas-pago/formas-pago-list' }
        ]
      },
      {
        label: 'Clientes y Proveedores',
        icon: 'pi pi-users',
        items: [
          { label: 'Clientes', icon: 'pi pi-fw pi-id-card', routerLink: '/clientes/clientes-list' },
          { label: 'Proveedores', icon: 'fa fa-handshake', routerLink: '/proveedores/proveedores-list' },
          { label: 'Cuentas', icon: 'fa fa-bank', routerLink: '/cuentas/cuentas-list' }
        ]
      },
      {
        label: 'Programables',
        icon: 'pi pi-calculator',
        items: [
          { label: 'Ingresos programados', icon: 'pi pi-fw pi-euro', routerLink: '/ingresos/ingresos-programados-list' },
          { label: 'Gastos programados', icon: 'pi pi-fw pi-code', routerLink: '/gastos/gastos-programados-list' },
        ]
      },
      { label: 'Resumen', icon: 'pi pi-fw pi-chart-line', routerLink: '/resumen/resumen-list' },
      { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() },
    ];
  }

  private getUnauthenticatedMenuItems(): MenuItem[] {
    return [
      { label: 'Iniciar Sesión', icon: 'pi pi-fw pi-sign-in', routerLink: 'auth/login' },
      { label: 'Registro', icon: 'pi pi-fw pi-user-plus', routerLink: 'auth/register' }
    ];
  }

  private logout(): void {

    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['auth/login']);
  }

  // Método que se llama cuando se cambia el modo
  toggleMode() {
    this.isDarkMode = !this.isDarkMode;
    this.isDarkModeSubject.next(this.isDarkMode);
    // Guardar el modo en localStorage
    localStorage.setItem('selectedMode', this.isDarkMode ? 'night' : 'day');
  }

  // Método que aplica el modo diurno o nocturno
  applyMode(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.offsetHeight; // Forzar repaint


    }
  }
}
