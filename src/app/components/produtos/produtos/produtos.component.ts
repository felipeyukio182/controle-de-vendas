import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarregandoService } from 'src/app/services/carregando.service';
import { FiltroService } from 'src/app/services/filtro.service';
import { HeaderService } from 'src/app/services/header.service';
import { InputService } from 'src/app/services/input.service';
import { OrdenacaoService } from 'src/app/services/ordenacao.service';
import { RequisicaoService } from 'src/app/services/requisicao.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilsService } from 'src/app/services/utils.service';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

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
  // Produtos

  public produtos: Array<any> = []
  public produtosFiltrado: Array<any> = []

  public produtoSelecionado: any = null
  public produtoFiltro: {nome: string, preco: string} = {
    nome: "",
    preco: "",
  }

  public produtoForm: FormGroup = new FormGroup({
    nome:  new FormControl("", Validators.required),
    preco: new FormControl("", Validators.required),
  })


  constructor(
    public headerService: HeaderService,
    public utilsService: UtilsService,
    private requisicaoService: RequisicaoService,
    public carregandoService: CarregandoService,
    public filtroService: FiltroService,
    private ordenacaoService: OrdenacaoService,
    public inputService: InputService,
    public toastService: ToastService,
    private router: Router
  ) {
    this.headerService.icone = "bi bi bi-bag"
    this.headerService.titulo = "Produtos"
  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem("usuario")!) || ""
    this.nomeUsuario = this.usuario.usuario

    this.buscarProdutos()
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Navegar nas Telas

  irParaIncluirProduto(): void {
    this.telaAtiva = "incluir"
    this.telaTitulo = "Novo produto"
    this.pagina = 1

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.produtoFiltro)
    this.produtosFiltrado = [ ...this.produtos ]
  }

  irParaEditarProduto(produto: any): void {
    this.telaAtiva = "editar"
    this.telaTitulo = "Editar produto"
    this.pagina = 1
    this.produtoSelecionado = produto
    this.produtoForm.setValue({
      nome:  this.produtoSelecionado.nome,
      preco: this.produtoSelecionado.preco,
    })

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.produtoFiltro)
    this.produtosFiltrado = [ ...this.produtos ]
  }

  irParaExcluirProduto(produto: any): void {
    this.telaAtiva = "excluir"
    this.telaTitulo = "Excluir produto"
    this.pagina = 1
    this.produtoSelecionado = produto
    this.produtoForm.setValue({
      nome:  this.produtoSelecionado.nome,
      preco: this.produtoSelecionado.preco,
    })

    this.produtoForm.disable()
    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.produtoFiltro)
    this.produtosFiltrado = [ ...this.produtos ]
  }

  cancelar(): void {
    this.telaAtiva = "consultar"
    this.telaTitulo = ""

    this.produtoForm.reset()
    this.produtoForm.enable()

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.produtoFiltro)
    this.produtosFiltrado = [ ...this.produtos ]
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Validação

  validarProdutoForm(): boolean {
    let valido = true
    let atributo = ""
    for(let atrib in this.produtoForm.value) {
      if(!this.produtoForm.value[atrib] || this.produtoForm.value[atrib].length < 1) {
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

  buscarProdutos(): void {
    this.carregandoService.carregando = true
    this.requisicaoService.get('produtos').subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.produtos = retorno
        this.produtosFiltrado = retorno
        console.log(retorno)
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
        console.log(err)
      }
    })
  }
  
  incluirProduto(): void {
    let valido = this.validarProdutoForm()
    if(!valido) {
      return
    }

    this.carregandoService.carregando = true
    this.requisicaoService.post('produtos', this.produtoForm.value).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.produtoForm.reset()
        console.log(retorno)
        this.toastService.sucesso("Produto cadastrado com sucesso!")
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        console.log(err)
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
      },
      complete: () => {
        this.buscarProdutos()
      }
    })
  }

  editarProduto(): void {
    let valido = this.validarProdutoForm()
    if(!valido) {
      return
    }

    this.carregandoService.carregando = true
    this.requisicaoService.put('produtos', this.produtoForm.value, {id: this.produtoSelecionado.id}).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.produtoForm.reset()
        console.log(retorno)
        this.toastService.sucesso("Produto alterado com sucesso!")
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
        console.log(err)
      },
      complete: () => {
        this.buscarProdutos()
      }
    })
    
  }

  excluirProduto(): void {
    this.carregandoService.carregando = true
    this.requisicaoService.delete('produtos', {id: this.produtoSelecionado.id}).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.produtoForm.reset()
        this.produtoForm.enable()
        console.log(retorno)
        this.toastService.sucesso("Produto excluido com sucesso!")
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
        console.log(err)
      },
      complete: () => {
        this.buscarProdutos()
      }
    })
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Utils

  exportarProdutosExcel(): void {
    // Espaçamento das colunas
    const colProp = [{wch: 25}, {wch: 10}]

    // Merge em duas ou mais linhas ou colunas ou linhas
    const mergeProp = [
      { s: { r: 0, c: 2 }, e: { r: 0, c: 4 } }
    ]

    let array = [
      ["Controle de Vendas", "", `Usuario: ${this.nomeUsuario}`],
      [],
      ["Nome/Descrição", "Preço (R$)"]
    ]

    let a = this.produtosFiltrado.map((produto: any) => {
      return [
        produto.nome,
        produto.preco
      ]
    })

    array.push(...a)

    let workSheet = XLSX.utils.aoa_to_sheet(array)
    workSheet['!cols'] = colProp
    workSheet['!merges'] = mergeProp

    let workbook = XLSX.utils.book_new()
    let nomeSheet = `Produtos`
    
    XLSX.utils.book_append_sheet(workbook, workSheet, nomeSheet)

    // Força o download
    let dataMs = Date.parse((new Date()).toString())
    let fileName = `Produtos_${dataMs}`;
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  filtrar(): void {
    this.pagina = 1
    this.produtosFiltrado = this.filtroService.filtrar(this.produtoFiltro, this.produtos, ["nome", "preco"])
  }

  voltarInicio(): void {
    this.router.navigate(['/inicio'])
  }

}
