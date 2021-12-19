import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { SessaoService } from 'src/app/services/sessao.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  private usuario: any = null
  public nomeUsuario: string = ""

  constructor(
    private sessaoService: SessaoService,
    public headerService: HeaderService,
    private router: Router
  ) {
    this.headerService.icone = "bi bi-house-door"
    this.headerService.titulo = "Menu"
  }

  ngOnInit(): void {
    this.usuario = this.sessaoService.buscarUsuario()
    this.nomeUsuario = this.usuario.usuario
  }

  irParaTela(tela: string) {
    this.router.navigate(["/" + tela])
  }

}
