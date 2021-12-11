import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { CarregandoComponent } from './carregando/carregando.component';
import { PaginacaoComponent } from './paginacao/paginacao.component';
import { BotaoMiniComponent } from './botao-mini/botao-mini.component';
import { LabelOrdenacaoComponent } from './label-ordenacao/label-ordenacao.component';
import { ToastComponent } from './toast/toast.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { InputPadraoComponent } from './input-padrao/input-padrao.component';



@NgModule({
  declarations: [
    CarregandoComponent,
    PaginacaoComponent,
    BotaoMiniComponent,
    LabelOrdenacaoComponent,
    ToastComponent,
    InputPadraoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbToastModule
  ],
  exports: [
    CarregandoComponent,
    PaginacaoComponent,
    BotaoMiniComponent,
    LabelOrdenacaoComponent,
    ToastComponent,
    InputPadraoComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TemplatesModule { }
