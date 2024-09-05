import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Frontend';

  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();
  isDarkMode: boolean = false;

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primengConfig.setTranslation({
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Limpiar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sm',
      firstDayOfWeek: 1
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
    }
  }
}
