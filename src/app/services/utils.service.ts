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

  validateInputValue(id: string): boolean {
    // debugger
    if(id == 'id') {
      return true
    }
    
    let input: HTMLInputElement|HTMLSelectElement = <HTMLInputElement|HTMLSelectElement>document.getElementById(id)
    
    if((input.required) && (!input.value || input.value.length < 1)) {
      input.focus()
      return false
    }
    return true
  }

  validateElementValue(element: any) {
    if((element.required) && (!element.value || element.value.length < 1)) {
      element.focus()
      return false
    }
    return true
  }

  formatDate_YYYYMMDD_To_DDMMYYYY(date: string): string {
    let formattedDate = ""
    let regexYYYYMMDD = (/^(\d{4})-(\d{2})-(\d{2})(.*)/)
    if(regexYYYYMMDD.test(date)) {
      formattedDate = date.replace(regexYYYYMMDD, "$3/$2/$1")
    }

    return formattedDate
  }

  formatNumberToPrice(price: string|number): string {
    let formattedPrice = ""
    if(typeof(price) == 'string') {
      price = Number.parseFloat(price.replace(",", "."))
    }
    formattedPrice = price.toFixed(2).replace(".", ",")
    return formattedPrice
  }

}
