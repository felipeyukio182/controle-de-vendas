import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { Observable } from 'rxjs';


@Component({
  selector: 'app-botao-mini',
  templateUrl: './botao-mini.component.html',
  styleUrls: ['./botao-mini.component.css']
})
export class BotaoMiniComponent implements OnInit {

  @Input() icone: string = ""
  @Input() titulo: string = ""
  @Input() estiloCss?: string = ""
  @Input() desabilitado?: boolean = false
  @Output() clique: EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  // Para evitar o evento do 'clique' quando estiver 'desabilitado'
  clicarBotaoMini() {
    if(!this.desabilitado) {
      this.clique.emit()
    }
  }

}
