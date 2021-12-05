import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { SessaoService } from './sessao.service';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {

  private baseUrl = environment.baseUrl
  private idUsuario = this.sessaoService.buscarIdUsuario()

  constructor(
    private http: HttpClient,
    private sessaoService: SessaoService
  ) { }

  get(url: string, query?: any): Observable<any> {
    let urlCompleta = `${this.baseUrl}/${url}?idUsuario=${this.idUsuario}`

    if(query) {
      const arrNomesQuery = Object.keys(query)
      for(let i in arrNomesQuery) {
        urlCompleta += `&${arrNomesQuery[i]}=${query[arrNomesQuery[i]]}`
      }
    }
    return this.http.get(urlCompleta)
  }

  post(url: string, body: any, query?: any): Observable<any> {
    let urlCompleta = `${this.baseUrl}/${url}?idUsuario=${this.idUsuario}`

    if(query) {
      const arrNomesQuery = Object.keys(query)
      for(let i in arrNomesQuery) {
        urlCompleta += `&${arrNomesQuery[i]}=${query[arrNomesQuery[i]]}`
      }
    }
    return this.http.post(urlCompleta, body)
  }

  put(url: string, body: any, query?: any): Observable<any> {
    let urlCompleta = `${this.baseUrl}/${url}?idUsuario=${this.idUsuario}`

    if(query) {
      const arrNomesQuery = Object.keys(query)
      for(let i in arrNomesQuery) {
        urlCompleta += `&${arrNomesQuery[i]}=${query[arrNomesQuery[i]]}`
      }
    }
    return this.http.put(urlCompleta, body)
  }

  delete(url: string, query?: any): Observable<any> {
    let urlCompleta = `${this.baseUrl}/${url}?idUsuario=${this.idUsuario}`

    if(query) {
      const arrNomesQuery = Object.keys(query)
      for(let i in arrNomesQuery) {
        urlCompleta += `&${arrNomesQuery[i]}=${query[arrNomesQuery[i]]}`
      }
    }
    return this.http.delete(urlCompleta)
  }
}
