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
  

  constructor(private router: Router) { }

  salvarSessao(chave: string, valor: any): void {
    window.localStorage.setItem(chave, valor)
    window.sessionStorage.setItem("logado", "S")

    this.logado = "S"
    this.usuario = valor
  }

  validarSessao(): boolean {
    console.log(this.logado == "S")
    console.log(window.sessionStorage.getItem("logado"))
    if(window.localStorage.getItem("usuario") && 
      (this.logado == "S" || window.sessionStorage.getItem("logado"))) {
      return true
    } else {
      this.sairSessao()
      return false
    }
  }


  buscarUsuario(): string {
    let usuario = window.localStorage.getItem("usuario") || ''
    return JSON.parse(usuario)
  }
  
  buscarIdUsuario(): string {
    let usuario = window.localStorage.getItem("usuario") || ''
    return JSON.parse(usuario).id
  }

  sairSessao(): void {
    window.sessionStorage.removeItem("logado")
    this.logado = "N"
    this.router.navigate(["/login"])
  }
  
  limparSessao(): void {
    window.localStorage.removeItem("usuario")
    window.sessionStorage.removeItem("logado")
  }
}
