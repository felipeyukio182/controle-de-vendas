import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarregandoService } from 'src/app/services/carregando.service';
import { FiltroService } from 'src/app/services/filtro.service';
import { HeaderService } from 'src/app/services/header.service';
import { OrdenacaoService } from 'src/app/services/ordenacao.service';
import { RequisicaoService } from 'src/app/services/requisicao.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

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
    private router: Router
  ) {
    this.headerService.icone = "bi bi bi-bag"
    this.headerService.titulo = "Produtos"
  }

  ngOnInit(): void {
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
  }

  cancelar(): void {
    this.telaAtiva = "consultar"
    this.telaTitulo = ""

    this.produtoForm.reset()
    this.produtoForm.enable()

    this.ordenacaoService.resetarOrdenacao()
    this.filtroService.resetarFiltro(this.produtoFiltro)
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
        console.log(err)
      }
    })
  }
  
  incluirProduto(): void {
    this.carregandoService.carregando = true
    this.requisicaoService.post('produtos', this.produtoForm.value).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.produtoForm.reset()
        console.log(retorno)
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        console.log(err)
        this.carregandoService.carregando = false
      },
      complete: () => {
        this.buscarProdutos()
      }
    })
  }

  editarProduto(): void {
    this.carregandoService.carregando = true
    this.requisicaoService.put('produtos', this.produtoForm.value, {id: this.produtoSelecionado.id}).subscribe({
      next: (retorno: any) => {
        this.carregandoService.carregando = false
        this.produtoForm.reset()
        console.log(retorno)
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
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
        this.telaAtiva = "consultar"
      },
      error: (err: any) => {
        this.carregandoService.carregando = false
        console.log(err)
      },
      complete: () => {
        this.buscarProdutos()
      }
    })
  }




  filtrar(): void {
    this.pagina = 1
    this.produtosFiltrado = this.filtroService.filtrar(this.produtoFiltro, this.produtos, ["nome", "preco"])
  }

  voltarInicio(): void {
    this.router.navigate(['/inicio'])
  }

}
