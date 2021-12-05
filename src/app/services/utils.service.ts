import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public estados: Array<string> = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO"
  ]

  constructor() { }

  formatarDataComBarraParaYYYYMMDDComTraco(dataComBarra: string): string {
    let regexDataComBarra = /(\d{2})\/(\d{2})\/(\d{4}).*/
    let dataFormatada = ""

    if(regexDataComBarra.test(dataComBarra)) {
      dataFormatada = dataComBarra.replace(regexDataComBarra, "$3-$2-$1")
    }

    return dataFormatada
  }
  
}
