import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { LoginComponent } from './login/login.component';
import { TemplatesModule } from '../templates/templates.module';



@NgModule({
  declarations: [
    LoginComponent,
    MenuPrincipalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TemplatesModule
  ]
})
export class ComponentsModule { }
