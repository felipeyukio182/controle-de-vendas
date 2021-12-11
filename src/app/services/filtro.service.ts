import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  constructor() { }

  filtrar(filtro: string|any, arrayOriginal: Array<any>, atrib: string|Array<string>): Array<any> {
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
          contemFiltro = elemento[a].toString().toLowerCase().includes(filtro[a].toLowerCase())
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

  resetarFiltro(filtro: string|any): void {
    if(typeof(filtro) == 'string') {
      filtro = ""
    } else if(typeof(filtro) == 'object'){
      for(let a in filtro) {
        filtro[a] = ""
      }
    }
  }
}
