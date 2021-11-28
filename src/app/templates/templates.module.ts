import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarregandoComponent } from './carregando/carregando.component';



@NgModule({
  declarations: [
    CarregandoComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CarregandoComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TemplatesModule { }
