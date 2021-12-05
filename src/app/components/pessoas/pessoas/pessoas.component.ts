import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from 'src/app/services/header.service';
import { RequisicaoService } from 'src/app/services/requisicao.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CarregandoService } from 'src/app/services/carregando.service';
import { FiltroService } from 'src/app/services/filtro.service';
import { OrdenacaoService } from 'src/app/services/ordenacao.service';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Navegar nas Telas

  public telaAtiva: "incluir"|"consultar"|"editar"|"excluir" = "consultar"
  public telaTitulo: string = ""

  public pagina: number = 1
  public tamanhoPagina: number = 10

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Pessoas

  public pessoas: Array<any> = []
  public pessoasFiltrada: Array<any> = []

  public pessoaSelecionada: any = null
  public pessoaFiltro: any = {
    nome: "",
    cnpjCpf: "",
    cidade: "",
    estado: ""
  }

  public pessoaForm: FormGroup = new FormGroup({
    nome:        new FormControl("", Validators.required),
    cnpjCpf:     new FormControl("", Validators.required),
    ie:          new FormControl(""),
    logradouro:  new FormControl("", Validators.required),
    numero:      new FormControl("", Validators.required),
    bairro:      new FormControl("", Validators.required),
    cidade:      new FormControl("", Validators.required),
    estado:      new FormControl("", Validators.required),
  })

  constructor(
    public headerService: HeaderService,
    public utilsService: UtilsService,
    private requisicaoService: RequisicaoService,
    public carregandoService: CarregandoService,
    public filtroService: FiltroService,
    private ordenacaoService: OrdenacaoService
  ) {
    this.headerService.icone = "bi bi-people"
    this.headerService.titulo = "Pessoas"
  }

  ngOnInit(): void {
    this.buscarPessoas()
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Navegar nas Telas

  irParaIncluirPessoa(): void {
    this.telaAtiva = "incluir"
    this.telaTitulo = "Incluir nova pessoa"

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.pessoaFiltro)
  }

  irParaEditarPessoa(pessoa: any): void {
    this.telaAtiva = "editar"
    this.telaTitulo = "Editar pessoa"
    this.pessoaSelecionada = pessoa
    this.pessoaForm.setValue({
      nome:       this.pessoaSelecionada.nome,
      cnpjCpf:    this.pessoaSelecionada.cnpjCpf,
      ie:         this.pessoaSelecionada.ie,
      logradouro: this.pessoaSelecionada.logradouro,
      numero:     this.pessoaSelecionada.numero,
      bairro:     this.pessoaSelecionada.bairro,
      cidade:     this.pessoaSelecionada.cidade,
      estado:     this.pessoaSelecionada.estado,
    })

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.pessoaFiltro)
  }
  irParaExcluirPessoa(pessoa: any): void {
    this.telaAtiva = "excluir"
    this.telaTitulo = "Excluir pessoa"
    this.pessoaSelecionada = pessoa
    this.pessoaForm.setValue({
      nome:       this.pessoaSelecionada.nome,
      cnpjCpf:    this.pessoaSelecionada.cnpjCpf,
      ie:         this.pessoaSelecionada.ie,
      logradouro: this.pessoaSelecionada.logradouro,
      numero:     this.pessoaSelecionada.numero,
      bairro:     this.pessoaSelecionada.bairro,
      cidade:     this.pessoaSelecionada.cidade,
      estado:     this.pessoaSelecionada.estado,
    })

    this.pessoaForm.disable()
    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.pessoaFiltro)
  }

  cancelar(): void {
    this.telaAtiva = "consultar"
    this.telaTitulo = ""

    this.pessoaForm.reset()
    this.pessoaForm.enable()

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.pessoaFiltro)
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Requisições

  buscarPessoas(): void {
    this.carregandoService.carregando = true
    this.requisicaoService.get('pessoas').subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.pessoas = retorno
        this.pessoasFiltrada = retorno
        console.log(retorno)
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        console.log(err)
      }
    })
  }
  
  incluirPessoa(): void {
    this.carregandoService.carregando = true
    this.requisicaoService.post('pessoas', this.pessoaForm.value).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.pessoaForm.reset()
        console.log(retorno)
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        console.log(err)
        this.carregandoService.carregando = false
      },
      complete: () => {
        this.buscarPessoas()
      }
    })
  }

  editarPessoa(): void {
    this.carregandoService.carregando = true
    this.requisicaoService.put('pessoas', this.pessoaForm.value, {id: this.pessoaSelecionada.id}).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.pessoaForm.reset()
        console.log(retorno)
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        console.log(err)
      },
      complete: () => {
        this.buscarPessoas()
      }
    })
    
  }

  excluirPessoa(): void {
    this.carregandoService.carregando = true
    this.requisicaoService.delete('pessoas', {id: this.pessoaSelecionada.id}).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.pessoaForm.reset()
        this.pessoaForm.enable()
        console.log(retorno)
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        console.log(err)
      },
      complete: () => {
        this.buscarPessoas()
      }
    })
  }

  filtrar(): void {
    this.pessoasFiltrada = this.filtroService.filtrar(this.pessoaFiltro, this.pessoas, ["nome", "cnpjCpf", "cidade", "estado"])
  }


}
