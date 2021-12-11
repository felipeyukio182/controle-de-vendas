import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-padrao',
  templateUrl: './input-padrao.component.html',
  styleUrls: ['./input-padrao.component.css']
})
export class InputPadraoComponent implements OnInit {


  @Input() identificador: string = ""
  @Input() tipo: string = "text"
  @Input() classe: string = "form-control form-control-sm"
  @Input() substituto: string = "Pesquisa..." // Placeholder

  // @Input() fControlName: string = ""

  @Input() model: any = ""
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>()

  public clicado: boolean = false

  constructor() { }
  
  ngOnInit(): void {
    
  }

  selecionarTextoInput(input: HTMLInputElement): void {
    if(!this.clicado) {
      this.clicado = true
      input.select()
    }
  }

  resetarTextoInput(): void {
    this.clicado = false
  }

  inputChange(e: any): void {
    this.modelChange.emit(e)
  }

}
