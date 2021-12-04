import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-botao-mini',
  templateUrl: './botao-mini.component.html',
  styleUrls: ['./botao-mini.component.css']
})
export class BotaoMiniComponent implements OnInit {

  @Input() icone: string = ""
  @Input() titulo: string = ""
  @Input() estiloCss?: string = ""

  constructor() { }

  ngOnInit(): void {
  }

}
