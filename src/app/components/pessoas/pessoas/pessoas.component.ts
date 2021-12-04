import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {

  public telaAtiva: "incluir"|"consultar"|"editar"|"excluir" = "consultar"
  public telaTitulo: string = ""

  public pagina = 1
  public tamanhoPagina = 10
  public list = [1,2,3,4,5,6,7,8,9,0,123,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

  constructor(
    public headerService: HeaderService,
    public utilsService: UtilsService
  ) {
    this.headerService.icone = "bi bi-people"
    this.headerService.titulo = "Pessoas"
  }

  ngOnInit(): void {
  }

  mudarDePagina(e: any) {
    this.pagina = e
  }

  incluirPessoa() {
    console.log("novaPessoa")
  }
  editarPessoa(pessoa: any) {
    console.log("editarPessoa")
  }
  excluirPessoa(pessoa: any) {
    console.log("excluirPessoa")
  }


}
