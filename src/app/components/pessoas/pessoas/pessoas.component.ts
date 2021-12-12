import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from 'src/app/services/header.service';
import { RequisicaoService } from 'src/app/services/requisicao.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CarregandoService } from 'src/app/services/carregando.service';
import { FiltroService } from 'src/app/services/filtro.service';
import { OrdenacaoService } from 'src/app/services/ordenacao.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { InputService } from 'src/app/services/input.service';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Gerais

  private usuario: any = null
  public nomeUsuario: string = ""

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

  ////////////////////////////////////////////////////////////////////////////////////////////////
  
  constructor(
    public headerService: HeaderService,
    public utilsService: UtilsService,
    private requisicaoService: RequisicaoService,
    public carregandoService: CarregandoService,
    public filtroService: FiltroService,
    public toastService: ToastService,
    private ordenacaoService: OrdenacaoService,
    public inputService: InputService,
    private router: Router
  ) {
    this.headerService.icone = "bi bi-people"
    this.headerService.titulo = "Pessoas"
  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem("usuario")!) || ""
    this.nomeUsuario = this.usuario.usuario

    this.buscarPessoas()
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Navegar nas Telas

  irParaIncluirPessoa(): void {
    this.telaAtiva = "incluir"
    this.telaTitulo = "Nova pessoa"
    this.pagina = 1

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.pessoaFiltro)
    this.pessoasFiltrada = [ ...this.pessoas ]
  }

  irParaEditarPessoa(pessoa: any): void {
    this.telaAtiva = "editar"
    this.telaTitulo = "Editar pessoa"
    this.pagina = 1
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
    this.pessoasFiltrada = [ ...this.pessoas ]
  }
  irParaExcluirPessoa(pessoa: any): void {
    this.telaAtiva = "excluir"
    this.telaTitulo = "Excluir pessoa"
    this.pagina = 1
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
    this.pessoasFiltrada = [ ...this.pessoas ]
  }

  cancelar(): void {
    this.telaAtiva = "consultar"
    this.telaTitulo = ""

    this.pessoaForm.reset()
    this.pessoaForm.enable()

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.pessoaFiltro)
    this.pessoasFiltrada = [ ...this.pessoas ]
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Validação

  validarPessoaForm(): boolean {
    let valido = true
    let atributo = ""
    for(let atrib in this.pessoaForm.value) {
      if(atrib == "ie") {
        continue

      } else if(atrib == "cnpjCpf" && (this.pessoaForm.value[atrib].length != 14 && this.pessoaForm.value[atrib].length != 18)) {
        valido = false
        atributo = atrib
        break

      } else if(!this.pessoaForm.value[atrib] || this.pessoaForm.value[atrib].length < 1) {
        valido = false
        atributo = atrib
        break
      }
    }

    if(!valido) {
      document.getElementById(atributo)?.focus()
      this.toastService.erro(`Campo '${atributo}' está inválido!`)
    }

    return valido
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
        this.toastService.erroAoRequisitarServidor()
        console.log(err)
      }
    })
  }
  
  incluirPessoa(): void {
    const valido = this.validarPessoaForm()
    if(!valido) {
      return
    }

    this.carregandoService.carregando = true
    this.requisicaoService.post('pessoas', this.pessoaForm.value).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.pessoaForm.reset()
        console.log(retorno)
          this.toastService.sucesso("Pessoa cadastrada com sucesso!")
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        console.log(err)
        this.carregandoService.carregando = false
          this.toastService.erroAoRequisitarServidor()
      },
      complete: () => {
        this.buscarPessoas()
      }
    })
  }

  editarPessoa(): void {
    const valido = this.validarPessoaForm()
    if(!valido) {
      return
    }

    this.carregandoService.carregando = true
    this.requisicaoService.put('pessoas', this.pessoaForm.value, {id: this.pessoaSelecionada.id}).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.pessoaForm.reset()
        console.log(retorno)
        this.toastService.sucesso("Pessoa alterada com sucesso!")
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
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
        this.toastService.sucesso("Pessoa excluida com sucesso!")
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
        console.log(err)
      },
      complete: () => {
        this.buscarPessoas()
      }
    })
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Utils

  exportarPessoasExcel(): void {
    // Espaçamento das colunas
    const colProp = [{wch: 35}, {wch: 18}, {wch: 12}, {wch: 15}, {wch: 6}, {wch: 10}, {wch: 10}, {wch: 6},]

    // Merge em duas ou mais linhas ou colunas ou linhas
    const mergeProp = [
      { s: { r: 0, c: 2 }, e: { r: 0, c: 4 } }
    ]

    let array = [
      ["Controle de Vendas", "", `Usuario: ${this.nomeUsuario}`],
      [],
      ["Razão Social/Nome", "CNPJ/CPF", "IE", "Logradouro", "Numero", "Bairro", "Cidade", "Estado"]
    ]

    let a = this.pessoasFiltrada.map((pessoa: any) => {
      return [
        pessoa.nome,
        pessoa.cnpjCpf,
        pessoa.ie || '',
        pessoa.logradouro,
        pessoa.numero,
        pessoa.bairro,
        pessoa.cidade,
        pessoa.estado
      ]
    })

    array.push(...a)

    let workSheet = XLSX.utils.aoa_to_sheet(array)
    workSheet['!cols'] = colProp
    workSheet['!merges'] = mergeProp

    let workbook = XLSX.utils.book_new()
    let nomeSheet = `Pessoas`
    
    XLSX.utils.book_append_sheet(workbook, workSheet, nomeSheet)

    // Força o download
    let dataMs = Date.parse((new Date()).toString())
    let fileName = `Pessoas_${dataMs}`;
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  filtrar(): void {
    this.pagina = 1
    this.pessoasFiltrada = this.filtroService.filtrar(this.pessoaFiltro, this.pessoas, ["nome", "cnpjCpf", "cidade", "estado"])
  }

  voltarInicio(): void {
    this.router.navigate(['/inicio'])
  }


}
