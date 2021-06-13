import { HttpService } from './../../http.service';
import { HttpClient } from '@angular/common/http';
import { RecursosComponent } from './../recursos/recursos.component';
import { DespesaComponent } from './../despesa/despesa.component';
import { ApiService } from './../../api.service';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { User } from './../shared/services/user';
import { CanActivate, Router } from '@angular/router';
import { AuthGuard } from './../shared/guard/auth.guard';
import { Conta, Despesa, Recurso } from './../shared/services/dashboard';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { FirebaseApp } from '@angular/fire';


export let listaContasBanco: Conta[] = [];
export let listaDespesas: any;
export let usersLogado: User;
import * as firebase from 'firebase';
import { CommonModule } from '@angular/common';
import { rootCertificates } from 'tls';

// import { DATABASE_URL } from 'angularfire2';
// firebase.default.initializeApp();
// const db = firebase.default.firestore();
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  formadicionarConta: FormGroup;
  formAdicionarRecursos: FormGroup;
  formAdicionarDep: FormGroup;
  usersFilter: any;
  users: User;
  uidUserLS: any;
  contasBanco: any;
  despesas: any;
  contaRel: Conta;
  public bancoConta: string[] = [];
  public listaCB: Conta[] = [];
  exibirContas: boolean;
  exibirDespesas: boolean;
  exibirCartoes: boolean;
  exibirRecursos: boolean;
  userRef: User;
  contaRef: Conta;
  loading = false;
  userlogado: any;
  successSendEmail: boolean = false;
  errorSendEmail: boolean = false;
  emailVazio: boolean = false;
  nomeVazio: boolean = false;
  exibirBoard: boolean;
  nomeInvalido: boolean;
  isDep: boolean =false;
  relacionamentos : any;
  infoChild : any;

  constructor(public authService: AuthService, private formDasboard: FormBuilder, public afs: AngularFirestore, private router: Router, public serviceDb: ApiService, public dep: DespesaComponent, public cmpRecurso: RecursosComponent, public http: HttpService) {

    this.formAdicionarRecursos = this.formDasboard.group({
      saldo: [],
      conta: [],
      descricao: [],
      recebido: [],
      tipo: [],
      receitaFixa: [],
      repetir: [],
      periodo: [],
      dataRecebimento: [],
    });

    this.formAdicionarDep = this.formDasboard.group({
      nome: [],
      email: []
    });
  }

  ngOnInit(): void {

    this.uidUserLS = JSON.parse(localStorage.getItem("user") || '{}');
    // console.log(this.uidUserLS);
    // console.log(this.authService.isLoggedIn);
    let user = firebase.default.auth().currentUser;
    this.userlogado = this.uidUserLS.uid;
    // console.log(user?.uid);
    if (this.authService.isLoggedIn || user?.uid || this.uidUserLS.uid) {

      this.usersInfo();
      this.getRelacionamentos();
      console.log('despesas mongoDB');
      console.log(this.serviceDb.GetDespesas());

    } else {
      console.log('usuario n logado');
      this.router.navigate(['']);
    }

    this.criarFormAddDep();

  }

  getRelacionamentos(){
    this.authService.getRelacionamento().subscribe(res => {
      this.filterRelacionamento(res);
    });
  }

  filterRelacionamento(uid: any) {
    let child;

    for (let index = 0; index < uid.length; index++) {
      if (uid[index].payload.doc?.data().idPai === this.uidUserLS.uid) {
        this.relacionamentos = uid[index].payload.doc?.data();
        console.log(uid[index].payload.doc?.data());
      }
    }
    if(this.relacionamentos){
      this.afs.collection("User").ref.where("uid", "==",  this.relacionamentos.idFilho)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.data());
            child = doc.data() as User;
            this.infoChild = {
              displayName : child.displayName,
              email : child.email
            }
          })
      })
      .catch((e) =>{
        console.log(e);
      })
    }
    this.exibirBoard = true;
    return this.relacionamentos;
  }

  criarFormAddDep() {
    this.formAdicionarDep = this.formDasboard.group({
      nome: ['', Validators.compose([Validators.required, Validators.pattern("/[A-Z][a-z]* [A-Z][a-z]*/")])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])]
    });
  }

  criarFormRecursos() {
    this.formAdicionarRecursos = this.formDasboard.group({
      saldo: ['', Validators.compose([Validators.required])],
      conta: ['', Validators.compose([Validators.required])],
      descricao: [''],
      recebido: [false, Validators.compose([Validators.required])],
      tipo: ['', Validators.compose([Validators.required])],
      receitaFixa: [false, Validators.compose([Validators.required])],
      repetir: [0],
      periodo: [''],
      dataRecebimento: [null, Validators.compose([Validators.required])],
    });
  }

  usersInfo = () => {
    // console.log('user logado - ' + this.uidUserLS);
    this.authService.getContaInfo().subscribe(res => {
      this.usersFilter = res;
      this.filterUser(this.usersFilter);
    });
  }

  filterUser(uid: any) {
    let retorno;
    for (let index = 0; index < uid.length; index++) {
      if (uid[index].payload.doc?.data().uid === this.uidUserLS.uid) {

        usersLogado = uid[index].payload.doc?.data();
        this.users = usersLogado;

      }

    }
    if(usersLogado.idPai && usersLogado.idPai !== ' '){
      this.isDep = true;
      console.log(this.isDep);
    }
    return usersLogado;
  }

  enviarEmail(nome: any, email: any) {
    // let nome = this.formAdicionarDep.get('nome')?.value;
    // let email = this.formAdicionarDep.get('email')?.value;

    console.log(nome);
    console.log(email);
    console.log(this.userlogado);
    this.loading = true;
    // this.buttionText = "Submiting...";
    let user = {
      name: nome,
      email: email,
      idPai: this.userlogado,
      nomeRemetente: usersLogado?.displayName
    }
    this.http.sendEmail("http://localhost:3000/sendmail", user).subscribe(
      data => {
        this.successSendEmail = true;
        let res: any = data;
        console.log(
          `${user.name} is successfully register and mail has been sent and the message id is ${res.messageId} ${this.userlogado}`
        );
      },
      err => {
        this.successSendEmail = false;
        this.errorSendEmail = true;
        this.loading = false;
        console.log(err);
        // this.buttionText = "Submit";
      }, () => {
        this.successSendEmail = true;
        this.errorSendEmail = false;
        this.loading = false;
        // this.buttionText = "Submit";
      }
    );
  }
  verifyEmail(email: any) {
    if (email.currentTarget.value === '') {
      this.emailVazio = true;
    } else {
      this.emailVazio = false;
    }
  }
  verifyName(name: any) {
    if (name.currentTarget.value === '') {
      this.nomeVazio = true;
    } else {
      this.nomeVazio = false;
    }

    if(!this.nomeVazio && name.currentTarget.value.split(' ').length <= 1){
      this.nomeInvalido = true;
    }else{
      this.nomeInvalido = false;
    }
  }
  verifyEmailKd(){
    this.emailVazio = false;
  }

  verifyNomeKd(){
    this.nomeVazio = false;
    this.nomeInvalido = false;
  }
  get nome() {
    return this.formAdicionarDep.get('nome');
  }
  get email() {
    return this.formAdicionarDep.get('email');
  }
  resetInfo() {
    this.successSendEmail = false;
    this.errorSendEmail = false;
    this.loading = false;
    this.nomeVazio = false;
    this.emailVazio = false;
    this.nomeInvalido = false;

    this.formAdicionarDep = this.formDasboard.group({
      nome: ['', Validators.compose([Validators.required, Validators.pattern("/[A-Z][a-z]* [A-Z][a-z]*/")])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])]
    });
  }
  showContas() {
    this.exibirContas = true;
    this.exibirDespesas = false;
    this.exibirCartoes = false;
    this.exibirRecursos = false;
    this.exibirBoard = false;
  }
  showDespesas() {
    this.exibirDespesas = true;
    this.exibirContas = false;
    this.exibirCartoes = false;
    this.exibirRecursos = false;
    this.exibirBoard = false;
  }
  showDashboard() {
    this.exibirBoard = true;
    this.exibirDespesas = false;
    this.exibirContas = false;
    this.exibirCartoes = false;
    this.exibirRecursos = false;
  }
  showRecursos() {
    this.exibirRecursos = true;
    this.exibirContas = false;
    this.exibirDespesas = false;
    this.exibirCartoes = false;
    this.exibirBoard = false;
  }
  showCC() {
    this.exibirCartoes = true;
    this.exibirContas = false;
    this.exibirDespesas = false;
    this.exibirRecursos = false;
    this.exibirBoard = false;
  }
}
