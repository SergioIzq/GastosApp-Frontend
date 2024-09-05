import { NgModule } from '@angular/core';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';


@NgModule({
  exports: [    
    ButtonModule,
    CardModule,
    SelectButtonModule,
    ToggleButtonModule,
    PasswordModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    CalendarModule,
    ToastModule,
    ToolbarModule,
    ProgressSpinnerModule,
    MenuModule,
    SidebarModule,
    TooltipModule,
    InputMaskModule,
    FieldsetModule,
    MessageModule,
    MessagesModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectModule,    
    SliderModule,
    ProgressBarModule,
    MenubarModule,        
    BadgeModule, 
    TagModule,
    ChartModule,
    PaginatorModule
  ]
})
export class PrimeNgModule { }
