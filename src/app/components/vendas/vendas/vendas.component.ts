import { Component, OnInit } from '@angular/core';
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
  // Navegar nas Telas

  public telaAtiva: "incluir"|"consultar"|"editar"|"excluir" = "consultar"
  public telaTitulo: string = ""

  public pagina = 1
  public tamanhoPagina = 10

  constructor(
    public headerService: HeaderService,
    public utilsService: UtilsService,
    private requisicaoService: RequisicaoService,
    public carregandoService: CarregandoService,
    public filtroService: FiltroService,
    private ordenacaoService: OrdenacaoService
  ) {
    this.headerService.icone = "bi bi-cart"
    this.headerService.titulo = "Vendas"
  }

  ngOnInit(): void {
  }

}
