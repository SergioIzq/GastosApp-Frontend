import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCERS } from './app.state';
import { EffectsModule } from '@ngrx/effects';
import { HomePageComponent } from './shared/home/home-page.component';
import { MenuComponent } from './shared/menu/menu.component';
import { MenuEffects } from '../app/shared/menu/ngrx/effects/menu.effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PrimeNgModule } from './primeng/primeng.module';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AuthInterceptor } from './shared/auth/auth.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { MenuReducer } from './shared/menu/ngrx/reducer/menu.reducer';
import { authReducer } from './shared/auth/ngrx/auth.reducer';
import { AuthEffects } from './shared/auth/ngrx/auth.effects';
import { ExportarExcelModule } from './shared/excel/exportar-excel.module';
import { PoliticaPrivacidadComponent } from './layout/legal/politica-privacidad/politica-privacidad.component';
import { AppFooterComponent } from './shared/footer/app-footer.component';
import { AvisoLegalComponent } from './layout/legal/aviso-legal/aviso-legal.component';
import { PoliticaCookiesComponent } from './layout/legal/politica-cookies/politica-cookies.component';
import { ContactoComponent } from './layout/legal/contacto/contacto.component';
import { AboutUsComponent } from './layout/legal/about-us/about-us.component';

// Register the locale data
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    PoliticaPrivacidadComponent,
    AvisoLegalComponent,
    PoliticaCookiesComponent,
    ContactoComponent,
    AboutUsComponent,
    AppFooterComponent,
    MenuComponent,
    NotFoundComponent,
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    PrimeNgModule,
    ExportarExcelModule,
    StoreModule.forRoot({ auth: authReducer, menu: MenuReducer }),
    EffectsModule.forRoot([MenuEffects, AuthEffects]),  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    MessageService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
