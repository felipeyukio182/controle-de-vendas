import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  ///////////////////////////////////////////////

  public usuario: string|null = null
  public logado: string = "N";

  ///////////////////////////////////////////////
  
  // public headerIcon = ""
  // public headerTitle = ""

  constructor(private router: Router) { }

  salvarSessao(chave: string, valor: any): void {
    window.localStorage.setItem(chave, valor)
    window.sessionStorage.setItem("logado", "S")

    this.logado = "S"
    this.usuario = valor
  }

  validarSessao(): boolean {
    if(window.localStorage.getItem("usuario") && 
      (this.logado == "S" || window.sessionStorage.getItem("logado"))) {
      return true
    } else {
      this.sairSessao()
      return false
    }
  }

  buscarIdUsuario(): string {
    let usuario = window.localStorage.getItem("usuario") || ''
    return JSON.parse(usuario).id
  }

  sairSessao(): void {
    window.sessionStorage.removeItem("logado")
    this.router.navigate(["/"])
  }
  
  limparSessao(): void {
    window.localStorage.removeItem("usuario")
    window.sessionStorage.removeItem("logado")
  }
}
