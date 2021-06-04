import { ApiService } from './../api.service';
import { Request, Response } from 'express';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule, Pipe } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { Routes, Router, RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { ReactiveFormsModule } from "@angular/forms";
import { InicioComponent } from './inicio/inicio.component';
import { ModalFeedbacksComponent } from './modal-feedbacks/modal-feedbacks.component';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AuthService } from "./shared/services/auth.service";
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { ConfirmaEmailComponent } from './confirma-email/confirma-email.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Platform } from '@angular/cdk/platform';
import { SpinnerComponent } from './spinner/spinner.component';
import { animate } from '@angular/animations';
import { ContaComponent } from './conta/conta.component';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { DespesaComponent } from './despesa/despesa.component';
import { HttpClientModule } from '@angular/common/http';
import { CartaoCreditoComponent } from './cartao-credito/cartao-credito.component';
import { RecursosComponent } from './recursos/recursos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
// import { CurrencyMaskModule } from "ng2-currency-mask";
import * as express from "express";
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';

import * as firebase from 'firebase';
import { firestore } from 'firebase-admin';
firebase.default.initializeApp(environment.firebase);

registerLocaleData(ptBr);

const appRoutes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'cadastro/:id', component: CadastroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'feedback', component: ModalFeedbacksComponent },
  { path: 'recuperarSenha', component: RecuperarSenhaComponent },
  { path: 'confirmarEmail', component: ConfirmaEmailComponent },
  { path: 'spinner', component: SpinnerComponent },
];

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};
@NgModule({
  declarations: [AppComponent, LoginComponent, CadastroComponent, DashboardComponent, BoardComponent, InicioComponent, ModalFeedbacksComponent, RecuperarSenhaComponent, ConfirmaEmailComponent, SpinnerComponent, ContaComponent, DespesaComponent, CartaoCreditoComponent, RecursosComponent],
  providers: [AuthService, ModalFeedbacksComponent, DespesaComponent, RecursosComponent, DashboardComponent, { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }, DatePipe,
    {
      provide: LOCALE_ID,
      useValue: "pt"
    }],
  bootstrap: [AppComponent],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes, { paramsInheritanceStrategy: 'always' }), ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule, AngularFireAuthModule, HttpClientModule,
    AngularFirestoreModule, MatProgressSpinnerModule, BrowserAnimationsModule, CurrencyMaskModule],
})
export class AppModule { }
