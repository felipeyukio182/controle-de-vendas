import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, OperatorFunction } from 'rxjs';
import {concatMap, debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
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
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css']
})
export class VendasComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Gerais

  private usuario: any = null
  public nomeUsuario: string = ""

  public pagina: number = 1
  public tamanhoPagina: number = 10

  public paginaProduto: number = 1
  public tamanhoPaginaProduto: number = 5

  public paginaTotal: number = 1
  public tamanhoPaginaTotal: number = 10

  public navAtiva: number = 1

  public estaEditandoProdutoVenda: boolean = false
  public indexProdutoEditado: number = -1

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Navegar nas Telas

  public telaAtiva: "incluir"|"consultar"|"editar"|"excluir" = "consultar"
  public telaTitulo: string = ""

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Vendas
  
  public dataInicial: string = ""
  public dataFinal: string = ""
  
  public dataInicialPesquisada: string = ""
  public dataFinalPesquisada: string = ""
  
  public vendas: Array<any> = []
  public vendasFiltrado: Array<any> = []

  public vendaSelecionada: any = null
  public vendaFiltro: any = {
    cliente: "",
    cnpjCpf: "",
    dataFormatada: "",
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Cliente e Produtos

  public clientes: Array<any> = []
  public clientesFiltrado: Array<any> = []
  public clienteSelecionado: any = null

  public produtos: Array<any> = []
  public produtosFiltrado: Array<any> = []
  public produtoSelecionado: any = null
  public precoProdutoSelecionado: any = null
  public quantidadeProdutoSelecionado: any = null

  public listaProdutosAdicionados: Array<any> = []
  public totalVenda: number = 0
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Utilizado no Typeahead do bootstrap

  pesquisarCliente: OperatorFunction<string, readonly string[]> = (txt$: Observable<string>) =>
  txt$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(texto => texto.length < 1 ? [] : 
      this.clientes.filter((cliente: any) => {
        const clienteString = cliente.id + ' - ' + cliente.nome + ' - ' + cliente.cidade + ' - ' + cliente.estado
        return clienteString.toLowerCase().includes(texto.toLowerCase())
      }).slice(0, 10)
    )
  )

  formatarClientePopUp(cli: {id: string, nome: string, cidade: string, estado: string}) {
    return cli.id + ' - ' + cli.nome + ' - ' + cli.cidade + ' - ' + cli.estado
  }

  formatarClienteInput(cli: {nome: string}) {
    return cli.nome
  }

  pesquisarProduto: OperatorFunction<string, readonly string[]> = (txt$: Observable<string>) =>
  txt$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(texto => texto.length < 1 ? [] :
      this.produtos.filter((produto: any) => {
        const produtoString = produto.id + ' - ' + produto.nome
        return produtoString.toLowerCase().includes(texto.toLowerCase())
      }).slice(0, 10)
    )
  )

  formatarProdutoPopUp(prod: {id: string, nome: string, cidade: string, estado: string}) {
    return prod.id + ' - ' + prod.nome
  }

  formatarProdutoInput(prod: {nome: string}) {
    return prod.nome
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(
    public headerService: HeaderService,
    public utilsService: UtilsService,
    private requisicaoService: RequisicaoService,
    public carregandoService: CarregandoService,
    public toastService: ToastService,
    public filtroService: FiltroService,
    public inputService: InputService,
    private ordenacaoService: OrdenacaoService,
    private router: Router
  ) {
    this.headerService.icone = "bi bi-cart"
    this.headerService.titulo = "Vendas"
  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem("usuario")!) || ""
    this.nomeUsuario = this.usuario.usuario

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
        this.toastService.erroAoRequisitarServidor()
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
    this.paginaProduto = 1
    this.paginaTotal = 1
    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.vendaFiltro)
    this.totalVenda = 0

    this.vendasFiltrado = [ ...this.vendas ]
  }

  irParaEditarVenda(venda: any): void {
    this.telaAtiva = "editar"
    this.telaTitulo = "Editar venda"

    this.pagina = 1
    this.paginaProduto = 1
    this.paginaTotal = 1
    this.vendaSelecionada = venda
    this.buscarProdutosVenda()
    for(let c of this.clientes) {
      if(c.id == venda.idCliente) {
        this.clienteSelecionado = c
        break
      }
    }
    this.totalVenda = venda.total

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.vendaFiltro)

    this.vendasFiltrado = [ ...this.vendas ]
  }

  irParaExcluirVenda(venda: any): void {
    this.telaAtiva = "excluir"
    this.telaTitulo = "Excluir venda"

    this.pagina = 1
    this.paginaProduto = 1
    this.paginaTotal = 1
    this.vendaSelecionada = venda
    this.buscarProdutosVenda()
    for(let c of this.clientes) {
      if(c.id == venda.idCliente) {
        this.clienteSelecionado = c
        break
      }
    }
    this.totalVenda = venda.total

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.vendaFiltro)

    this.vendasFiltrado = [ ...this.vendas ]
  }

  cancelar(): void {
    this.telaAtiva = "consultar"
    this.telaTitulo = ""

    this.resetarVenda()

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.vendaFiltro)
    this.totalVenda = 0

    this.vendasFiltrado = [ ...this.vendas ]
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Operações na venda

  adicionarProduto(): void {
    const valido = this.validarProduto()
    if(!valido) {
      return
    }

    if(this.estaEditandoProdutoVenda) {
      this.totalVenda -= this.listaProdutosAdicionados[this.indexProdutoEditado].quantidade * this.listaProdutosAdicionados[this.indexProdutoEditado].preco
      this.listaProdutosAdicionados[this.indexProdutoEditado] = {
        id: this.produtoSelecionado.id,
        nome: this.produtoSelecionado.nome,
        quantidade: parseFloat(this.quantidadeProdutoSelecionado),
        preco: parseFloat(this.precoProdutoSelecionado)
      }
      this.estaEditandoProdutoVenda = false
      this.indexProdutoEditado = -1

    } else {
      this.listaProdutosAdicionados.push({
        id: this.produtoSelecionado.id,
        nome: this.produtoSelecionado.nome,
        quantidade: parseFloat(this.quantidadeProdutoSelecionado),
        preco: parseFloat(this.precoProdutoSelecionado)
      })
  
    }
    
    this.totalVenda += parseFloat(this.quantidadeProdutoSelecionado) * parseFloat(this.precoProdutoSelecionado)

    this.quantidadeProdutoSelecionado = null
    this.precoProdutoSelecionado = null
    this.produtoSelecionado = null

    document.getElementById("produto")?.focus()
  }
  editarProduto(i: number): void {
    this.indexProdutoEditado = i + ((this.paginaProduto - 1) * this.tamanhoPaginaProduto)
    this.estaEditandoProdutoVenda = true
    this.produtoSelecionado = this.listaProdutosAdicionados[this.indexProdutoEditado]
    this.quantidadeProdutoSelecionado = this.listaProdutosAdicionados[this.indexProdutoEditado].quantidade
    this.precoProdutoSelecionado = this.listaProdutosAdicionados[this.indexProdutoEditado].preco
    this.navAtiva = 2
  }
  editarProdutoCancelar(): void {
    this.estaEditandoProdutoVenda = false
    this.indexProdutoEditado = -1

    this.quantidadeProdutoSelecionado = null
    this.precoProdutoSelecionado = null
    this.produtoSelecionado = null
    
    this.navAtiva = 2
  }
  excluirProduto(i: number): void {
    let index = i + ((this.paginaProduto - 1) * this.tamanhoPaginaProduto)
    this.totalVenda -= parseFloat(this.listaProdutosAdicionados[index].quantidade) * parseFloat(this.listaProdutosAdicionados[index].preco)
    this.listaProdutosAdicionados.splice(index, 1)
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Validações

  validarProduto(): boolean {
    let valido = true

    if(!this.produtoSelecionado || typeof(this.produtoSelecionado) == "string") {
      this.toastService.erro("Favor informe o produto.")
      document.getElementById("produto")?.focus()
      valido = false
      return valido
    }
    if(!this.quantidadeProdutoSelecionado || this.quantidadeProdutoSelecionado <= 0) {
      this.toastService.erro("Favor informe uma quantidade.")
      document.getElementById("quantidade")?.focus()
      valido = false
      return valido
    }
    if(!this.precoProdutoSelecionado || this.precoProdutoSelecionado <= 0) {
      this.toastService.erro("Favor informe um preço valido.")
      document.getElementById("preco")?.focus()
      valido = false
      return valido
    }

    return valido
  }

  validarVenda(): boolean {
    let valido = true
    
    if(!this.clienteSelecionado || typeof(this.clienteSelecionado) == "string") {
      this.toastService.erro("Favor informe o cliente!")
      this.navAtiva = 1
      document.getElementById("cliente")?.focus()
      valido = false
      return valido
    }
    if(this.listaProdutosAdicionados.length < 1) {
      this.toastService.erro("Favor informe um produto!")
      this.navAtiva = 2
      document.getElementById("produto")?.focus()
      valido = false
      return valido
    }

    return valido
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
    return this.requisicaoService.get('vendas', {dataInicial: this.dataInicial, dataFinal: `${this.dataFinal} 23:59:59`})
  }

  pesquisarVendasNoPeriodo(): void {
    this.carregandoService.carregando = true
    this.buscarVendas().subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.vendas = retorno
        this.vendasFiltrado = retorno

        this.dataInicialPesquisada = this.dataInicial
        this.dataFinalPesquisada = this.dataFinal
      },  
      error: (err: any) => {
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
        console.log(err)
      }
    })
  }
  
  buscarProdutosVenda(): void {
    const query = {
      idVenda: this.vendaSelecionada.id
    }
    this.carregandoService.carregando = true
    this.requisicaoService.get('produtosVenda', query).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        console.log(retorno)
        this.listaProdutosAdicionados = []
        for(let p of retorno) {
          this.listaProdutosAdicionados.push({
            id: p.idProduto,
            nome: p.produto,
            quantidade: p.quantidade,
            preco: p.preco
          })
        }
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
        console.log(err)
      }
    })
  }
  
  incluirVenda(): void {
    const valido = this.validarVenda()
    if(!valido) {
      return
    }

    const param = {
      idCliente: this.clienteSelecionado.id,
      produtos: this.listaProdutosAdicionados
    }
    this.carregandoService.carregando = true
    this.requisicaoService.post('vendas', param).pipe(
      concatMap((retorno: any) => {
        if(retorno == "ok") {
          return this.buscarVendas()
        } else {
          throw retorno
        }
      })
    ).subscribe({
      next: (retorno: any) => {
        console.log(retorno)
        this.carregandoService.carregando = false
        
        this.vendas = retorno
        this.vendasFiltrado = retorno

        this.resetarVenda()
        this.toastService.sucesso("Venda cadastrada com sucesso!")
        this.telaAtiva = 'consultar'
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
        console.log(err)
      }
    })
  }

  editarVenda(): void {
    const valido = this.validarVenda()
    if(!valido) {
      return
    }

    const param = {
      idCliente: this.clienteSelecionado.id,
      produtos: this.listaProdutosAdicionados
    }
    const query = {
      idVenda: this.vendaSelecionada.id
    }
    this.carregandoService.carregando = true

    this.requisicaoService.put('vendas', param, query).pipe(
      concatMap((retorno: any) => {
        if(retorno == "ok") {
          return this.buscarVendas()
        } else {
          throw retorno
        }
      })
    ).subscribe({
      next: (retorno: any) => {
        console.log(retorno)
        this.carregandoService.carregando = false
        
        this.vendas = retorno
        this.vendasFiltrado = retorno

        this.resetarVenda()
        this.toastService.sucesso("Venda alterada com sucesso!")
        this.telaAtiva = 'consultar'
      },
      error: (err: any) => {
        console.log("caiu no err")
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
        console.log(err)
      }
    })
  }

  excluirVenda(): void {
    const query = {
      idVenda: this.vendaSelecionada.id
    }
    this.carregandoService.carregando = true

    this.requisicaoService.delete('vendas', query).pipe(
      concatMap((retorno: any) => {
        if(retorno == "ok") {
          return this.buscarVendas()
        } else {
          throw retorno
        }
      })
    ).subscribe({
      next: (retorno: any) => {
        console.log(retorno)
        this.carregandoService.carregando = false

        this.vendas = retorno
        this.vendasFiltrado = retorno

        this.resetarVenda()
        this.toastService.sucesso("Venda excluida com sucesso!")
        this.telaAtiva = 'consultar'
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        this.toastService.erroAoRequisitarServidor()
        console.log(err)
      }
    })
  }

  

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Selecionando produto com Typeahead

  selecionarProduto(e: any): void {
    this.produtoSelecionado = e
    this.precoProdutoSelecionado = e.item.preco
    this.quantidadeProdutoSelecionado = 1
  }

  selecionarProdutoChange(): void {
    if(typeof(this.produtoSelecionado) == "string") {
      this.precoProdutoSelecionado = null
      this.quantidadeProdutoSelecionado = null
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Utils
  
  montarDatasInicialFinal(): void {
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

  exportarVendasExcel(): void {
    // Espaçamento das colunas
    const colProp = [{wch: 38}, {wch: 18}, {wch: 20}, {wch: 15}]

    // Merge em duas ou mais linhas ou colunas ou linhas
    const mergeProp = [
      { s: { r: 0, c: 2 }, e: { r: 0, c: 4 } }
    ]

    let array = [
      ["Controle de Vendas", "", `Usuario: ${this.nomeUsuario}`],
      [],
      [`Vendas do periodo: ${this.dataInicialPesquisada} - ${this.dataFinalPesquisada}`],
      [],
      ["Cliente", "CNPJ/CPF", "Data", "Total Venda (R$)"]
    ]

    let totalPeriodo = 0
    let a = this.vendasFiltrado.map((venda: any) => {
      totalPeriodo += venda.total
      return [
        venda.cliente,
        venda.cnpjCpf,
        venda.dataFormatada,
        venda.total.toFixed(2)
      ]
    })

    array.push(...a, ["", "", "Total (R$)", totalPeriodo.toFixed(2).toString()])

    let workSheet = XLSX.utils.aoa_to_sheet(array)
    workSheet['!cols'] = colProp
    workSheet['!merges'] = mergeProp

    let workbook = XLSX.utils.book_new()
    let nomeSheet = `Vendas`
    
    XLSX.utils.book_append_sheet(workbook, workSheet, nomeSheet)

    // Força o download
    let dataMs = Date.parse((new Date()).toString())
    let fileName = `Vendas_${this.dataInicialPesquisada}_${this.dataFinalPesquisada}_${dataMs}`;
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  filtrar(): void {
    console.log(this.vendas)
    this.pagina = 1
    this.vendasFiltrado = this.filtroService.filtrar(this.vendaFiltro, this.vendas, ["cliente", "cnpjCpf", "dataFormatada"])
  }

  resetarVenda(): void {
    this.quantidadeProdutoSelecionado = null
    this.precoProdutoSelecionado = null
    this.clienteSelecionado = null
    this.produtoSelecionado = null
    this.listaProdutosAdicionados = []

    this.navAtiva = 1

    this.estaEditandoProdutoVenda = false
    this.indexProdutoEditado = -1
  }

  voltarInicio(): void {
    this.router.navigate(['/inicio'])
  }

}
