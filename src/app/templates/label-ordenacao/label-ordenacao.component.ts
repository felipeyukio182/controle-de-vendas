import { Component, Input, OnInit } from '@angular/core';
import { OrdenacaoService } from 'src/app/services/ordenacao.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-label-ordenacao',
  templateUrl: './label-ordenacao.component.html',
  styleUrls: ['./label-ordenacao.component.css']
})
export class LabelOrdenacaoComponent implements OnInit {

  @Input() label: string = ''
  @Input() nome: string = ''
  @Input() atrib: string|Array<string> = ''
  @Input() atrib2: string|Array<string>|null = null
  @Input() formatoData: string|null = null
  @Input() arr: Array<any> = []

  constructor(
    public utils: UtilsService,
    public ordenacaoService: OrdenacaoService
  ) { }

  ngOnInit(): void { }


}