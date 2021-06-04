import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Conta, Despesa } from './../shared/services/dashboard';
import { listaContasBanco, listaDespesas, usersLogado } from './../dashboard/dashboard.component';
import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../api.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.scss']
})
export class ContaComponent implements OnInit {
  formadicionarConta: FormGroup;
  public lsContas: Array<[string, any]> = [];
  public lsDespesas: Despesa[] = [];
  public uidUserLS: any;
  public totalDespesas: Number[] = [];
  public valoTotalDesp: any;
  public updateContaInfo: any;

  contaBanco : any;
  contaNome : any;
  DeleteId : any;
  saldoConta: any;
  public listTotalRecursos: Number[] = [];
  idDelete: string;
  errorDelete: boolean = false;
  successDelete: boolean = false;
  listRecursos: Array<[string, any]> = [];
  constructor(public apService: ApiService, private formConta: FormBuilder, public service: ApiService ) {
    this.formadicionarConta = this.formConta.group({
      nome: [],
      saldo: [],
      totalDespesas: [],
      descricao: [],
      banco: [],
      tipo: [],
    });
  }

  ngOnInit(): void {
    this.uidUserLS = JSON.parse(localStorage.getItem("user") || '{}');
    console.log('init');
    this.lsContas = [];
    const conta = this.apService.GetContas().then(conta => {
      // this.despesas = data;
      for (let i = 0; i < conta.length; i++) {
        if(usersLogado.idPai && usersLogado.idPai !== ' '){
          if (conta[i].uid === usersLogado.idPai ) {

            this.lsContas.push(conta[i]);
            // console.log(this.lsContas);
          }
        }else{
          if (conta[i].uid === this.uidUserLS.uid) {

            this.lsContas.push(conta[i]);
            // console.log(this.lsContas);
          }
        }
      }
      return conta;
    });
    this.getRecursosConta(this.lsContas);
    this.getDespesasConta(this.lsContas);
    this.criarFormConta();

  }
  criarFormConta() {
    this.formadicionarConta = this.formConta.group({
      nome: ['', Validators.compose([Validators.required])],
      saldo: ['', Validators.compose([Validators.required])],
      descricao: ['', Validators.compose([Validators.required])],
      totalDespesas: ['', Validators.compose([Validators.required])],
      banco: ['', Validators.compose([Validators.required])],
      tipo: ['', Validators.compose([Validators.required])],
    });
  }
  criarConta() {
    var user = firebase.default.auth().currentUser;
    // console.log(user)
    if (user?.uid) {
      const conta: Conta = {
        nome: this.formadicionarConta.get('nome')?.value,
        uid: usersLogado.idPai && usersLogado.idPai !== ' ' ? usersLogado.idPai : user?.uid,
        banco: this.formadicionarConta.get('banco')?.value,
        totalDespesas: 0,
        saldo: '',
        tipo: this.formadicionarConta.get('tipo')?.value,
        descricao: this.formadicionarConta.get('descricao')?.value,
      }
      console.log(conta);
      // return this.serviceDb.AddContas(conta, 'contas');
      this.service.AddContas(conta, 'contas').subscribe(
        value => {
          this.lsContas = [];
          this.ngOnInit();
          console.log("sucess")
        },
        err => console.log('error')
      );
      return 'success';
    } else {
      alert("usuario n logaod");
      return false;
    }
  }
  getRecursosConta(contas: any) {
    var user = firebase.default.auth().currentUser;
    // this.valoTotalDesp = this.totalDespesas.reduce(reducer);
    const recursos = this.apService.Getrecursos().then(recurso => {
      for (let i = 0; i < recurso.length; i++) {
        for (let j = 0; j < contas.length; j++) {

          if (recurso[i].contaId === contas[j]._id) {
            this.listRecursos.push(recurso[i]);
            this.listTotalRecursos.push(recurso[i].saldo);
            contas[j].saldo = Number(contas[j].saldo) + Number(recurso[i].saldo);
            console.log(contas);
            // this.serviceDb.push(conta[i]);

          }
        }
      }

    });
    console.log(this.listTotalRecursos);
    console.log(this.listRecursos);
    return recursos;
  }
  editConta(idConta: any){
    this.updateContaInfo = idConta;
    this.apService.GetConta(idConta).subscribe(
      val => {
        this.formadicionarConta = this.formConta.group({
          nome: [val.nome, Validators.compose([Validators.required])],
          saldo: [val.saldo, Validators.compose([Validators.required])],
          descricao: [val.descricao, Validators.compose([Validators.required])],
          totalDespesas: [val.totalDespesas, Validators.compose([Validators.required])],
          banco: [val.banco, Validators.compose([Validators.required])],
          tipo: [val.tipo, Validators.compose([Validators.required])],
        });
      },
      err => {
        console.log(err);
      }
    );

  }
  updateConta(idConta: any){
    var user = firebase.default.auth().currentUser;

    const conta: Conta = {
      nome: this.formadicionarConta.get('nome')?.value,
      uid: usersLogado.idPai && usersLogado.idPai !== ' ' ? usersLogado.idPai : user?.uid,
      banco: this.formadicionarConta.get('banco')?.value,
      totalDespesas: 0,
      saldo: '',
      tipo: this.formadicionarConta.get('tipo')?.value,
      descricao: this.formadicionarConta.get('descricao')?.value,
    }

    this.apService.UpdateConta(idConta,conta).subscribe(
      val=>{
        this.lsContas = [];
        this.ngOnInit();
      },
      err => {

      }
    )

  }

  deleteContaInfo(idConta: any,contaNome: any, contaBanco:any, saldoConta: any){
    this.DeleteId = idConta;
    this.contaNome = contaNome;
    this.contaBanco = contaBanco;
    this.saldoConta = saldoConta;

  }
  deleteConta(idConta: any){
    this.apService.DeleteConta(idConta).subscribe(
      val =>{
        this.successDelete = true;
        this.lsContas = [];
        this.ngOnInit();
      },
      err =>{
        this.errorDelete = true;
      }
    )
  }
  getDespesasConta(contas: any) {
    const desp = this.apService.GetDespesas().then(desp => {
      // this.despesas = data;
      for (let i = 0; i < desp.length; i++) {
        for (let j = 0; j < contas.length; j++) {
          if (desp[i].contaId === contas[j]._id) {
            this.lsDespesas.push(desp[i]);
            this.totalDespesas.push(Number(desp[i].valor));
            contas[j].totalDespesas = Number(contas[j].totalDespesas) ? Number(contas[j].totalDespesas) + Number(desp[i].valor) : Number(desp[i].valor);
            console.log(contas);
          }
        }
      }
      // const reducer = (accumulator: any, currentValue: any) => accumulator + currentValue;
      // this.valoTotalDesp = this.totalDespesas.reduce(reducer);

      // console.log(this.lsDespesas);
      // console.log(this.totalDespesas);
      return desp;
    });


  }
  zerarVariaveis() {
    this.successDelete = false;
    this.errorDelete = false;
  }
}
