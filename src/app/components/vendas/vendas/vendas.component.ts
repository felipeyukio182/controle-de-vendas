import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable, OperatorFunction } from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { CarregandoService } from 'src/app/services/carregando.service';
import { FiltroService } from 'src/app/services/filtro.service';
import { HeaderService } from 'src/app/services/header.service';
import { OrdenacaoService } from 'src/app/services/ordenacao.service';
import { RequisicaoService } from 'src/app/services/requisicao.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css']
})
export class VendasComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Navegar nas Telas e utils

  public telaAtiva: "incluir"|"consultar"|"editar"|"excluir" = "consultar"
  public telaTitulo: string = ""

  public pagina: number = 1
  public tamanhoPagina: number = 10

  public navAtiva: number = 1

  public estaEditandoProdutoVenda: boolean = false
  public indexProdutoEditado: number = -1

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Vendas
  
  public dataInicial: string = ""
  public dataFinal: string = ""
  
  public dataInicialPesquisada: string = ""
  public dataFinalPesquisada: string = ""
  
  public vendas: Array<any> = []
  public vendasFiltrado: Array<any> = [{a: 1}]
  
  // public vendaSelecionada: any = {idVenda: '10'}
  public vendaSelecionada: any = null
  public vendaFiltro: any = {
    
  }
  
  // public vendaForm: FormGroup = new FormGroup({
  //   idCliente:  new FormControl("", Validators.required),
  //   // clienteIdNomeCidadeEstado:  new FormControl("", Validators.required),
  //   produtos: new FormGroup({
  //     idProduto: new FormControl("", Validators.required),
  //     quantidade: new FormControl("", Validators.required),
  //     valor: new FormControl("", Validators.required)
  //   }),
  // })
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Cliente e Produtos

  public clientes: Array<any> = []
  public clientesFiltrado: Array<any> = []
  public clienteSelecionado: any = null

  public clienteIdNomeCidadeEstado: string = ""

  public produtos: Array<any> = []
  public produtosFiltrado: Array<any> = []
  public produtoSelecionado: any = null
  public precoProdutoSelecionado: any = null

  public produtoIdNome: string = ""

  public listaProdutosAdicionados: Array<any> = []
  public totalVenda: number = 0
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Utilizado no Typeahead do bootstrap

  pesquisarCliente: OperatorFunction<string, readonly string[]> = (txt$: Observable<string>) =>
  txt$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(texto => {
      if(texto.length < 1) {
        return []
      } else {
        let cli = this.clientes.filter((cliente: any) => {
          const clienteString = cliente.id + ' - ' + cliente.nome + ' - ' + cliente.cidade + ' - ' + cliente.estado
          return clienteString.toLowerCase().includes(texto.toLowerCase())
        })
        
        cli = cli.map((cliente: any) => {
          const clienteString = cliente.id + ' - ' + cliente.nome + ' - ' + cliente.cidade + ' - ' + cliente.estado
          return clienteString
        }).slice(0, 10)

        return cli
      }
    })
  )

  pesquisarProduto: OperatorFunction<string, readonly string[]> = (txt$: Observable<string>) =>
  txt$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(texto => {
      if(texto.length < 1) {
        return []
      } else {
        let prod = this.produtos.filter((produto: any) => {
          const produtoString = produto.id + ' - ' + produto.nome
          return produtoString.toLowerCase().includes(texto.toLowerCase())
        })
        
        prod = prod.map((produto: any) => {
          const produtoString = produto.id + ' - ' + produto.nome
          return produtoString
        }).slice(0, 10)

        return prod
      }
    })
  )

  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(
    public headerService: HeaderService,
    public utilsService: UtilsService,
    private requisicaoService: RequisicaoService,
    public carregandoService: CarregandoService,
    public filtroService: FiltroService,
    private ordenacaoService: OrdenacaoService,
    private router: Router
  ) {
    this.headerService.icone = "bi bi-cart"
    this.headerService.titulo = "Vendas"
  }

  ngOnInit(): void {
    this.montarDatasInicialFinal()

    this.carregandoService.carregando = true

    forkJoin([
      this.buscarPessoas(),
      this.buscarProdutos(),
      this.buscarVendas()
    ]).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false

        this.clientes = retorno[0]
        this.clientesFiltrado = retorno[0]

        this.produtos = retorno[1]
        this.produtosFiltrado = retorno[1]

        this.vendas = retorno[2]
        this.vendasFiltrado = retorno[2]

        this.dataInicialPesquisada = this.dataInicial
        this.dataFinalPesquisada = this.dataFinal
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        console.log(err)
      }
    })
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Navegar nas Telas

  irParaIncluirVenda(): void {
    this.telaAtiva = "incluir"
    this.telaTitulo = "Nova venda"

    this.pagina = 1
    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.vendaFiltro)
  }

  irParaEditarVenda(venda: any): void {
    this.telaAtiva = "editar"
    this.telaTitulo = "Editar venda"

    this.pagina = 1
    this.vendaSelecionada = venda
    this.buscarProdutosVenda()

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.vendaFiltro)
  }

  irParaExcluirVenda(venda: any): void {
    this.telaAtiva = "excluir"
    this.telaTitulo = "Excluir venda"

    this.pagina = 1
    this.vendaSelecionada = venda
    this.buscarProdutosVenda()

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.vendaFiltro)
  }

  cancelar(): void {
    this.telaAtiva = "consultar"
    this.telaTitulo = ""


    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.vendaFiltro)
  }

  pesquisarVendasNoPeriodo() {
    this.carregandoService.carregando = true
    this.buscarVendas().subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.vendas = retorno
        this.vendasFiltrado = retorno
      },  
      error: (err: any) => {
        this.carregandoService.carregando = false
        console.log(err)
      }
    })
  }

  adicionarProduto() {
    if(this.estaEditandoProdutoVenda) {

      this.totalVenda -= this.listaProdutosAdicionados[this.indexProdutoEditado].preco
      this.listaProdutosAdicionados[this.indexProdutoEditado] = {
        id: this.produtoSelecionado.id,
        nome: this.produtoSelecionado.nome,
        preco: parseFloat(this.precoProdutoSelecionado)
      }
      this.estaEditandoProdutoVenda = false
      this.indexProdutoEditado = -1

    } else {
      this.listaProdutosAdicionados.push({
        id: this.produtoSelecionado.id,
        nome: this.produtoSelecionado.nome,
        preco: parseFloat(this.precoProdutoSelecionado)
      })
  
    }
    
    this.totalVenda += parseFloat(this.precoProdutoSelecionado)

    this.precoProdutoSelecionado = null
    this.produtoIdNome = ""
    this.produtoSelecionado = null
  }
  editarProduto(i: number) {
    this.indexProdutoEditado = i
    this.estaEditandoProdutoVenda = true
    this.produtoSelecionado = this.listaProdutosAdicionados[i]
    this.precoProdutoSelecionado = this.listaProdutosAdicionados[i].preco
    this.produtoIdNome = this.listaProdutosAdicionados[i].id + ' - ' + this.listaProdutosAdicionados[i].nome
    this.navAtiva = 2
  }
  editarProdutoCancelar() {
    this.estaEditandoProdutoVenda = false
    this.indexProdutoEditado = -1

    this.precoProdutoSelecionado = null
    this.produtoIdNome = ""
    this.produtoSelecionado = null
  }
  excluirProduto(i: number) {
    this.totalVenda -= parseFloat(this.listaProdutosAdicionados[i].preco)
    this.listaProdutosAdicionados.splice(i, 1)
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Requisições

  buscarProdutos(): Observable<any> {
    return this.requisicaoService.get('produtos')
  }

  buscarPessoas(): Observable<any> {
    return this.requisicaoService.get('pessoas')
  }
  

  buscarVendas(): Observable<any> {
    return this.requisicaoService.get('vendas', {dataInicial: this.dataInicial, dataFinal: this.dataFinal})
  }

  buscarProdutosVenda() {
    this.requisicaoService.get('produtosVenda', {idVenda: this.vendaSelecionada.idVenda}).subscribe({
      next: (retorno: any) => {
        console.log(retorno)
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
  
  incluirVenda(): void {

  }

  editarVenda(): void {

  }

  excluirVenda(): void {

  }

  

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Selecionando cliente e produto com Typeahead

  selecionarCliente(e: any) {
    console.log(e)
    const string = e.item
    let idCliente = string.replace(/(\d+)\s-\s(.*)/, "$1")
    for(let c of this.clientes) {
      if(idCliente == c.id) {
        this.clienteSelecionado = c
        break
      }
    }
  }
  clienteEstaSelecionado() { // Função para resetar o clienteSelecionado e idCliente do vendaForm, caso não esteja selecionado pela função selecionarCliente()
    let estaSelecionado = false
    for(let cliente of this.clientes) {
      if(this.clienteIdNomeCidadeEstado == cliente.id + ' - ' + cliente.nome + ' - ' + cliente.cidade + ' - ' + cliente.estado) {
        estaSelecionado = true
        break
      }
    }
    if(!estaSelecionado) {
      this.clienteSelecionado = null
    }
  }

  selecionarProduto(e: any) {
    console.log(e)
    const string = e.item
    let idProduto = string.replace(/(\d+)\s-\s(.*)/, "$1")
    // this.vendaForm.controls.idCliente.setValue(idCliente)
    for(let p of this.produtos) {
      if(idProduto == p.id) {
        this.produtoSelecionado = p
        this.precoProdutoSelecionado = p.preco
        break
      }
    }
  }
  produtoEstaSelecionado() { // Função para resetar o produtoSelecionado, caso não esteja selecionado pela função selecionarProduto()
    let estaSelecionado = false
    for(let produto of this.produtos) {
      if(this.produtoIdNome == produto.id + ' - ' + produto.nome) {
        estaSelecionado = true
        break
      }
    }
    if(!estaSelecionado) {
      this.produtoSelecionado = null
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  
  montarDatasInicialFinal() {
    // Um dia tem 86400000 milissegundos
    let dFinal: any = new Date()
    let dFinalMs = Date.parse(dFinal)
    let dInicialMs = dFinalMs - (86400000 * 30)
    let dInicial = new Date(dInicialMs)

    this.dataInicial = dInicial.toLocaleString().replace(/(\d{2})\/(\d{2})\/(\d{4}).*/, '$3-$2-$1')
    this.dataFinal = dFinal.toLocaleString().replace(/(\d{2})\/(\d{2})\/(\d{4}).*/, '$3-$2-$1')

    this.dataInicialPesquisada = this.dataInicial
    this.dataFinalPesquisada = this.dataFinal
  }

  filtrar(): void {
    this.pagina = 1
    this.vendasFiltrado = this.filtroService.filtrar(this.vendaFiltro, this.vendas, ["nome", "preco"])
  }

  voltarInicio(): void {
    this.router.navigate(['/inicio'])
  }

}
