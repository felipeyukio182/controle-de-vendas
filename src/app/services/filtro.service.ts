import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  constructor() { }

  filtrar(filtro: string|any, arrayOriginal: Array<any>, atrib: string|Array<string>) {
    let arrayFiltrado = []

    // Filtro simples
    if(typeof(atrib) == 'string' && typeof(filtro) == 'string') {
      arrayFiltrado = arrayOriginal.filter((elemento: any) => {
        return elemento[atrib].toLowerCase().includes(filtro.toLowerCase())
      })

    // Filtro composto de varios atributos
    } else if(typeof(atrib) == 'object' && typeof(filtro) == 'object') {
      arrayFiltrado = arrayOriginal.filter((elemento: any) => {
        let contemFiltro = true
        for(let a of atrib) {
          contemFiltro = elemento[a].toLowerCase().includes(filtro[a].toLowerCase())
          if(!contemFiltro) {
            break
          }
        }
        return contemFiltro
      })

    // Filtro invalido
    } else {
      console.log("Parametros Invalidos!")
      return []
    }

    return arrayFiltrado
  }

  resetarFiltro(filtro: string|any): string|any {
    if(typeof(filtro) == 'string') {
      filtro = ""
    } else {
      for(let a of filtro) {
        a = ""
      }
    }

    return filtro
  }
}
