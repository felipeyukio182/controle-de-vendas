import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  constructor() { }

  public estaClicadoArr: Array<{id: string, clicado: boolean}> = []

  // Usar no evento (click)
  selecionarTextoInput(input: HTMLInputElement): void {
    for(let c of this.estaClicadoArr) {
      if(input.id == c.id) {
        if(c.clicado) {
          return
        } else {
          input.select()
          c.clicado = true
          return
        }
      }
    }

    input.select()
    this.estaClicadoArr.push({
      id: input.id,
      clicado: true
    })
  }

  // Usar no evento (blur)
  resetarTextoInput(input: HTMLInputElement): void {
    for(let c of this.estaClicadoArr) {
      if(input.id == c.id) {
        c.clicado = false
      }
    }
  }

}
