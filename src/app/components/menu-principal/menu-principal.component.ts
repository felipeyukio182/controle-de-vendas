import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {

  public sidenavEstaAberta: boolean = false
  public opcaoMenuEstaAberta: boolean = false

  public menuOpcoes: Array<{nome: string, icone: string, estaAberta: boolean, subOpcoes: Array<any>}> = [
    {
      nome: 'Pessoas',
      icone: 'bi bi-people',
      estaAberta: false,
      subOpcoes: [
        {
          nome: 'teste1',
          rota: ''
        },
        {
          nome: 'teste2',
          rota: ''
        },
        {
          nome: 'teste3',
          rota: ''
        },
      ]
    },
    {
      nome: 'Produtos',
      icone: 'bi bi bi-bag',
      estaAberta: false,
      subOpcoes: [
        {
          nome: 'teste12',
          rota: ''
        },
        {
          nome: 'teste22',
          rota: ''
        },
        {
          nome: 'teste32',
          rota: ''
        },
      ]
    },
    {
      nome: 'Vendas',
      icone: 'bi bi-cart',
      estaAberta: false,
      subOpcoes: [
        {
          nome: 'teste133',
          rota: ''
        },
        {
          nome: 'teste233',
          rota: ''
        },
      ]
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  abrirFecharSidenav(): void {
    this.sidenavEstaAberta = !this.sidenavEstaAberta
  }
  abrirFecharOpcaoMenu(opcao?: any): void {
    if(this.sidenavEstaAberta) {
      opcao.estaAberta = !opcao.estaAberta
    }
  }

}
