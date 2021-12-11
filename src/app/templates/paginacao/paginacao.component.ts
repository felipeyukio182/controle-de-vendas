import { AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginacao',
  templateUrl: './paginacao.component.html',
  styleUrls: ['./paginacao.component.css']
})
export class PaginacaoComponent implements OnInit, AfterViewChecked {

  @Input() pagina: any = 1
  @Input() itensPorPagina: any = 10
  @Input() tamanhoLista: any = 100

  @Output() paginaChange: EventEmitter<number> = new EventEmitter<number>()

  public qtdePaginas: number = 0
  public arrayPaginas: Array<number> = []

  constructor() {
    
  }

  ngOnInit(): void {
    // console.log(this.tamanhoLista)
    this.arrayPaginas = []
    this.qtdePaginas = Math.ceil(this.tamanhoLista/this.itensPorPagina)
    for(let i = 0; i < this.qtdePaginas; i++) {
      this.arrayPaginas.push(i)
    }
  }
  
  ngAfterViewChecked() {
    this.arrayPaginas = []
    this.qtdePaginas = Math.ceil(this.tamanhoLista/this.itensPorPagina)
    for(let i = 0; i < this.qtdePaginas; i++) {
      this.arrayPaginas.push(i)
    }
  }

  selecionarPagina(pagina: number) {
    this.pagina = pagina
    this.paginaChange.emit(this.pagina)
  }

  irParaProximaPagina() {
    if(this.pagina + 1 > this.qtdePaginas) {
      return
    }
    this.pagina++
    this.paginaChange.emit(this.pagina)
  }
  
  irParaPaginaAnterior() {
    if(this.pagina - 1 < 1) {
      return
    }
    this.pagina--
    this.paginaChange.emit(this.pagina)
  }

}
