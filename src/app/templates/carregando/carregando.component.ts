import { Component, OnInit } from '@angular/core';
import { CarregandoService } from 'src/app/services/carregando.service';

@Component({
  selector: 'app-carregando',
  templateUrl: './carregando.component.html',
  styleUrls: ['./carregando.component.css']
})
export class CarregandoComponent implements OnInit {

  constructor(public carregandoService: CarregandoService) { }

  ngOnInit(): void {
  }

}
