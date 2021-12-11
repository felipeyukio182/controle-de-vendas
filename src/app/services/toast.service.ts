import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  public toasts: Array<any> = [];

  constructor() { }

  show(mensagem: string, opcoes?: any): void {
    this.toasts.push({ mensagem, ...opcoes });
  }

  remove(toast: any): void {
    this.toasts = this.toasts.filter(t => t != toast);
  }

  sucesso(texto: string): void {
    this.show(texto, { classname: 'bg-success text-light' })
  }

  erro(texto: string): void {
    this.show(texto, { classname: 'bg-danger text-light' })
  }

  erroAoRequisitarServidor(): void {
    this.show("Erro ao requisitar servidor", { classname: 'bg-danger text-light' })
  }
}

