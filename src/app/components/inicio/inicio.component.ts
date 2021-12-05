import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = this.sessaoService.buscarUsuario()
    this.nomeUsuario = this.usuario.usuario
  }

  irParaTela(tela: string) {
    this.router.navigate(["/" + tela])
  }

}
