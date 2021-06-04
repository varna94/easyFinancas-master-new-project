import { infoFeedback } from './../shared/services/auth.service';
// import { infoFeedback } from './../app.component';
import { Component, OnInit, NgZone } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
@Component({
  selector: 'app-modal-feedbacks',
  templateUrl: './modal-feedbacks.component.html',
  styleUrls: ['./modal-feedbacks.component.scss']
})
export class ModalFeedbacksComponent implements OnInit {

  public Tipo: any;
  public Titulo: any;
  public Mensagem: any;
  public Acao: any;
  constructor(private _location: Location, public router: Router,) { }

  ngOnInit(): void {
    this.Titulo = infoFeedback.titulo;
    this.Mensagem = infoFeedback.mensagem;
    this.Tipo = infoFeedback.tipo;
    this.Acao = infoFeedback.acao;

  }
  voltar() {
    this.router.navigate(['login']);
  }
}
