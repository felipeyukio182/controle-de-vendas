import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarregandoService {

  public carregando: boolean = false

  constructor() { }
}
