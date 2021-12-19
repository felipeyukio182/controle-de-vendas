import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { SessaoService } from 'src/app/services/sessao.service';



@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {

  public sidenavEstaAberta: boolean = false
  public opcaoMenuEstaAberta: boolean = false

  public menuOpcoes: Array<{nome: string, icone: string, estaAberta: boolean, mouseEstaEmCima: boolean, subOpcoes: Array<any>}> = [
    {
      nome: 'Pessoas',
      icone: 'bi bi-people',
      estaAberta: false,
      mouseEstaEmCima: false,
      subOpcoes: [
        {
          nome: 'Pessoas',
          rota: '/pessoas'
        },
      ]
    },
    {
      nome: 'Produtos',
      icone: 'bi bi bi-bag',
      estaAberta: false,
      mouseEstaEmCima: false,
      subOpcoes: [
        {
          nome: 'Produtos',
          rota: '/produtos'
        },
      ]
    },
    {
      nome: 'Vendas',
      icone: 'bi bi-cart',
      estaAberta: false,
      mouseEstaEmCima: false,
      subOpcoes: [
        {
          nome: 'Vendas',
          rota: '/vendas'
        },
      ]
    },
  ]

  constructor(
    public sessaoService: SessaoService,
    public headerService: HeaderService,
    private router: Router
  ) {
    this.headerService.icone = "bi bi-house-door"
    this.headerService.titulo = "Menu"
  }

  ngOnInit(): void {
  }

  abrirFecharSidenav(): void {
    for(let o of this.menuOpcoes) {
      o.estaAberta = false
    }
    this.sidenavEstaAberta = !this.sidenavEstaAberta
  }
  abrirFecharOpcaoMenu(opcao?: any): void {
    if(this.sidenavEstaAberta) {
      for(let o of this.menuOpcoes) {
        if(o != opcao) {
          o.estaAberta = false
        }
      }

      opcao.estaAberta = !opcao.estaAberta
    }
  }
  mostrarPopUp(opcao: any): void{
    opcao.mouseEstaEmCima = true
  }
  esconderPopUp(opcao: any): void{
    opcao.mouseEstaEmCima = false
  }

  irParaTela(nome: string, icone: string, rota: string): void{
    this.headerService.icone = icone
    this.headerService.titulo = nome
    this.router.navigate([rota])
  }

  irParaMenuPrincipal(): void {
    this.headerService.icone = "bi bi-house-door"
    this.headerService.titulo = "Menu"
    this.router.navigate(['/inicio'])
  }

}
