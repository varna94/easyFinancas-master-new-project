import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './../../api.service';
import { Despesa, Conta } from './../shared/services/dashboard';
import { listaDespesas, DashboardComponent, usersLogado } from './../dashboard/dashboard.component';
import { Component, OnInit } from '@angular/core';
import { json } from 'body-parser';
import * as firebase from 'firebase';

@Component({
  selector: 'app-despesa',
  templateUrl: './despesa.component.html',
  styleUrls: ['./despesa.component.scss']
})
export class DespesaComponent implements OnInit {
  public despesas: Array<[string, any]> = [];
  public despesasLs: Despesa[] = [];
  public uidUserLS: any;
  formadicionarDespesa: FormGroup;
  saldo: string;
  conta: string;
  idDelete: string;
  errorDelete: boolean = false;
  successDelete: boolean = false;
  updateDespInfo :any;
  public bancoConta: string[] = [];
  public listaCB: Array<[string, any]> = [];

  constructor(public apService: ApiService, private formDasboard: FormBuilder) {
    this.formadicionarDespesa = this.formDasboard.group({
      valor: [],
      categoria: [],
      descricao: [],
      fixa: [],
      conta: [],
      status: [],
      dataVencimento: [],
      repetir: [],
      periodo: [],
    });
  }

  ngOnInit(): void {
    // let desp;
    this.uidUserLS = JSON.parse(localStorage.getItem("user") || '{}')
    const desp = this.apService.GetDespesas().then(data => {
      // this.despesas = data;
      for (let i = 0; i < data.length; i++) {
        if(usersLogado.idPai && usersLogado.idPai !== ' '){
          if (data[i].uid === usersLogado.idPai ) {
            this.despesas.push(data[i]);
          }
        }else{
          if (data[i].uid === this.uidUserLS.uid) {
            this.despesas.push(data[i]);
          }
        }
      }
      return data;
    });
    this.criarFormDespesa();
    this.contaInfo();
    console.log(this.despesas);

  }
  // Buscar contas para vincular a despesa
  contaInfo() {
    const conta = this.apService.GetContas().then(conta => {
      // this.despesas = data;
      for (let i = 0; i < conta.length; i++) {
        if(usersLogado.idPai && usersLogado.idPai !== ' '){
          if (conta[i].uid === usersLogado.idPai) {
            this.bancoConta.push(conta[i]._id);
            this.listaCB.push(conta[i]);
            // this.serviceDb.push(conta[i]);
            console.log(this.bancoConta);
          }
        }else{
          if (conta[i].uid === this.uidUserLS.uid) {
            this.bancoConta.push(conta[i]._id);
            this.listaCB.push(conta[i]);
            // this.serviceDb.push(conta[i]);
            console.log(this.bancoConta);
          }
        }

      }
      return conta;
    });
  }

  criarFormDespesa() {
    this.formadicionarDespesa = this.formDasboard.group({
      valor: ['', Validators.compose([Validators.required])],
      categoria: ['', Validators.compose([Validators.required])],
      descricao: ['', Validators.compose([Validators.required])],
      fixa: [false, Validators.compose([Validators.required])],
      conta: ['', Validators.compose([Validators.required])],
      contaId: [''],
      status: ['', Validators.compose([Validators.required])],
      dataVencimento: ['', Validators.compose([Validators.required])],
      repetir: [''],
      periodo: [''],
    });
  }
  criarDespesa() {
    var user = firebase.default.auth().currentUser;

    console.log(user)
    if (user?.uid) {
      const despesa: Despesa = {
        dataVencimento: this.formadicionarDespesa.get('dataVencimento')?.value,
        valor: this.formadicionarDespesa.get('valor')?.value,
        uid: usersLogado.idPai && usersLogado.idPai !== ' ' ? usersLogado.idPai : user.uid,
        descricao: this.formadicionarDespesa.get('descricao')?.value,
        fixa: this.formadicionarDespesa.get('fixa')?.value,
        status: this.formadicionarDespesa.get('status')?.value,
        conta: this.formadicionarDespesa.get('conta')?.value.split('-')[0],
        contaId: this.formadicionarDespesa.get('conta')?.value.split('-')[1],
        categoria: this.formadicionarDespesa.get('categoria')?.value,
        periodo: this.formadicionarDespesa.get('periodo')?.value,
        repetir: this.formadicionarDespesa.get('repetir')?.value
      }
      this.apService.AddDespesas(despesa, 'despesas').subscribe(
        value => {
          this.despesas = [];
          this.listaCB = [];
          this.ngOnInit();
          console.log("sucess")
        },

        err => console.log('error')
      );
      return 'success';
    } else {
      alert("usuario n logado");
      return false;
    }

  }

  deleteInfo(id: string, saldo: string, conta: string) {
    this.idDelete = id;
    this.conta = conta;
    this.saldo = saldo;
  }
  deleteDespesa(idDel: string) {
    // idDel = '123';
    console.log('entrou delete!');
    this.apService.DeleteDespesas(idDel).subscribe(
      val => {
        this.successDelete = true;
        this.despesas = [];
        this.listaCB = [];
        this.ngOnInit();
        console.log('success - ' + val);
      },

      err => {
        this.errorDelete = true;
        console.log('error - ' + err);
      }
    );
  }
  updateDespesa(idDespesa: any){
    var user = firebase.default.auth().currentUser;

    const despesa: Despesa = {
      dataVencimento: this.formadicionarDespesa.get('dataVencimento')?.value,
      valor: this.formadicionarDespesa.get('valor')?.value,
      uid: usersLogado.idPai && usersLogado.idPai !== ' ' ? usersLogado.idPai : user?.uid,
      descricao: this.formadicionarDespesa.get('descricao')?.value,
      fixa: this.formadicionarDespesa.get('fixa')?.value,
      status: this.formadicionarDespesa.get('status')?.value,
      conta: this.formadicionarDespesa.get('conta')?.value.split('-')[0],
      contaId: this.formadicionarDespesa.get('conta')?.value.split('-')[1],
      categoria: this.formadicionarDespesa.get('categoria')?.value,
      periodo: this.formadicionarDespesa.get('periodo')?.value,
      repetir: this.formadicionarDespesa.get('repetir')?.value
    }

    this.apService.UpdateDespesas(idDespesa,despesa).subscribe(
      val => {
        this.despesas = [];
        this.listaCB = [];
        this.ngOnInit();
        console.log(val);
      },
      err => {

      }
    )
  }
  editDespesa(idDespesa: any){
    this.updateDespInfo = idDespesa;
    this.apService.GetDespesa(idDespesa).subscribe(
      val => {
        console.log(val);
        console.log(val.dataVencimento.split('T')[0]);
        this.formadicionarDespesa = this.formDasboard.group({
          valor: [val.valor, Validators.compose([Validators.required])],
          categoria: [val.categoria, Validators.compose([Validators.required])],
          descricao: [val.descricao, Validators.compose([Validators.required])],
          fixa: [val.fixa, Validators.compose([Validators.required])],
          conta: [val.conta, Validators.compose([Validators.required])],
          contaId: [''],
          status: [val.status, Validators.compose([Validators.required])],
          dataVencimento: [val.dataVencimento.split('T')[0], Validators.compose([Validators.required])],
          repetir: [val.repetir],
          periodo: [val.periodo],
        });
      },
      err => {

      }
    );
  }
  zerarVariaveis() {
    this.successDelete = false;
    this.errorDelete = false;
  }
}
