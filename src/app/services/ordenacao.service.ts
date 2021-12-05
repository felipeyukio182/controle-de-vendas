import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenacaoService {

  public tipoOrdenacao: any = {}
  public ativo: any = {}

  constructor(public utils: UtilsService) { }

  ordenar(arr: Array<any>, nome: string, atrib: string|Array<string>|null = null, atrib2: string|Array<string>|null = null, formatoData: string|null = null): void {
    if(this.tipoOrdenacao[nome] == null || this.tipoOrdenacao[nome] == undefined) {
      this.tipoOrdenacao[nome] = "C"
    }

    // Deixar somente um icone ativo ao mesmo tempo
    if(!this.ativo[nome]) {
      for(let a in this.ativo) {
        if(this.ativo[a]) {
          this.ativo[a] = false
        }
      }
      this.ativo[nome] = true
    }

    if(this.tipoOrdenacao[nome] == "C") {
      this.tipoOrdenacao[nome] = "D"
      if(atrib) {
        this.ordenarComAtributo(arr, atrib, atrib2, formatoData)
  
      } else {
        this.ordenarSemAtributo(arr)
      }
    } else {
      this.tipoOrdenacao[nome] = "C"
      arr.reverse()
    }
  }
  
  ordenarComAtributo(arr: Array<any>, atrib: string|Array<string>, atrib2: string|Array<string>|null, formatoData: string|null): void {
    arr.sort((a: any, b: any): number => {
      // Preciso clonar para não alterar o array original
      let aClone = JSON.parse(JSON.stringify(a))
      let bClone = JSON.parse(JSON.stringify(b))

      // Se é um array de atributos
      if(Array.isArray(atrib)) {
        let stringA = this.buscarAtributoDoObj(a, 0, atrib)
        let stringB = this.buscarAtributoDoObj(b, 0, atrib)

        // Comparar pelo primeiro atributo
        if(stringA < stringB) {
          return -1
        }
        if(stringA > stringB) {
          return 1
        }

      } else {
        // Verificar se é no formado de data (Se precisar eu posso adicionar mais formatos de data aqui!!!)
        if(formatoData && formatoData == "dd/MM/yyyy") {
          aClone[atrib] = this.utils.formatarDataComBarraParaYYYYMMDDComTraco(a[atrib])
          bClone[atrib] = this.utils.formatarDataComBarraParaYYYYMMDDComTraco(b[atrib])
        }
  
        // Comparar pelo primeiro atributo
        if(aClone[atrib] < bClone[atrib]) {
          return -1
        }
        if(aClone[atrib] > bClone[atrib]) {
          return 1
        }
      }
      

      // Se tiver um segundo atributo para comparação
      if(atrib2) {
        if(Array.isArray(atrib2)) {
          let stringA = this.buscarAtributoDoObj(a, 0, atrib2)
          let stringB = this.buscarAtributoDoObj(b, 0, atrib2)
  
          // Comparar pelo primeiro atributo
          if(stringA < stringB) {
            return -1
          }
          if(stringA > stringB) {
            return 1
          }
        } else {
          if(aClone[atrib2] < bClone[atrib2]) {
            return -1
          }
          if(aClone[atrib2] > bClone[atrib2]) {
            return 1
          }
        }
      }
      return 0
    })
  }

  ordenarSemAtributo(arr: Array<any>): void {
    arr.sort((a: any, b: any) => {
      if(a < b) {
        return -1
      }
      if(a > b) {
        return 1
      }
      return 0
    })
  }

  // Recursivo
  buscarAtributoDoObj(obj: Object|string|any, i: number, arrAtrib: Array<string>): Object|string {
    if(typeof(obj) != "object") {
      return obj
    } else {    
      console.log(arrAtrib[i])
      console.log(i)
      return this.buscarAtributoDoObj(obj[arrAtrib[i]], i + 1, arrAtrib)
    }
  }

  resetarOrdenacao(): void {
    this.tipoOrdenacao = {}
    this.ativo = {}
  }
}
