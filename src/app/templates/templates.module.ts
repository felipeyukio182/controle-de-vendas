import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarregandoComponent } from './carregando/carregando.component';
import { PaginacaoComponent } from './paginacao/paginacao.component';
import { BotaoMiniComponent } from './botao-mini/botao-mini.component';
import { LabelOrdenacaoComponent } from './label-ordenacao/label-ordenacao.component';



@NgModule({
  declarations: [
    CarregandoComponent,
    PaginacaoComponent,
    BotaoMiniComponent,
    LabelOrdenacaoComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CarregandoComponent,
    PaginacaoComponent,
    BotaoMiniComponent,
    LabelOrdenacaoComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TemplatesModule { }
