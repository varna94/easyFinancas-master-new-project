import { usersLogado } from './../dashboard/dashboard.component';
import { Subscriber } from 'rxjs';
import { Cartao, DespesaCC } from './../shared/services/dashboard';
import { ApiService } from './../../api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Key } from 'readline';

@Component({
  selector: 'app-cartao-credito',
  templateUrl: './cartao-credito.component.html',
  styleUrls: ['./cartao-credito.component.scss']
})
export class CartaoCreditoComponent implements OnInit {
  public formAdicionarCartao: FormGroup;
  public listCartoes: Array<[string, any]> = [];
  public formadicionarDespesaCC: FormGroup;
  public mostrarComprasFatura: boolean = false;
  public despCC: Array<[string, any]> = [];
  exibirModalAddDespesasCC: boolean;
  nomeCartao: string;
  bandeira: string;
  idCC: string;
  uidUserLS: any;
  deleteCc: any;
  errorDelete: boolean = false;
  successDelete: boolean = false;
  idDeleteCC: any;
  nomeCc: any;
  bandeiraCc: any;
  limiteCc: any;
  public bancoConta: string[] = [];
  public listaCB: Array<[string, any]> = [];
  constructor(public service: ApiService, private formCC: FormBuilder) {
    this.formAdicionarCartao = this.formCC.group({
      nome: [],
      bandeira: [],
      banco: [],
      limite: [],
      dataFechamentoFatura: [],
      dataVencimentoFatura: [],
      descricao: []
    });
    this.formadicionarDespesaCC = this.formCC.group({
      valor: [],
      categoria: [],
      descricao: [],
      fixa: [],
      conta: [],
      status: [],
    });
  }

  ngOnInit(): void {
    this.uidUserLS = JSON.parse(localStorage.getItem("user") || '{}');
    this.getCartoes();
    this.criarFormDespesa();
    this.getContaInfo();
    this.crirFormCartao();
  }
  crirFormCartao() {
    this.formAdicionarCartao = this.formCC.group({
      nome: [''],
      bandeira: [''],
      banco: [''],
      limite: ['', Validators.compose([Validators.required])],
      dataFechamentoFatura: [''],
      dataVencimentoFatura: [''],
      descricao: ['']
    });

  }
  criarFormDespesa() {
    this.formadicionarDespesaCC = this.formCC.group({
      valor: ['', Validators.compose([Validators.required])],
      categoria: ['', Validators.compose([Validators.required])],
      descricao: ['', Validators.compose([Validators.required])],
      fixa: [false, Validators.compose([Validators.required])],
      dataVencimento: ['', Validators.compose([Validators.required])],
      repetir: [''],
      periodo: [''],
      id: ['']
    });
  }
  getContaInfo(){
    const conta = this.service.GetContas().then(conta => {
      // this.despesas = data;
      for (let i = 0; i < conta.length; i++) {
        if(usersLogado.idPai && usersLogado.idPai !== ' '){
          if (conta[i].uid === usersLogado.idPai) {
            this.bancoConta.push(conta[i]._id);
            this.listaCB.push(conta[i]);
          }
        }else{
          if (conta[i].uid === this.uidUserLS.uid) {
            this.bancoConta.push(conta[i]._id);
            this.listaCB.push(conta[i]);
          }
        }
      }
      return conta;
    });
  }
  criarCartao() {
    var user = firebase.default.auth().currentUser;
    this.listCartoes = [];
    if (user?.uid) {
      const cartao: Cartao = {
        nome: this.formAdicionarCartao.get('nome')?.value,
        uid: usersLogado.idPai && usersLogado.idPai !== ' ' ? usersLogado.idPai : user?.uid,
        banco: this.formAdicionarCartao.get('banco')?.value,
        bandeira: this.formAdicionarCartao.get('bandeira')?.value,
        limite: this.formAdicionarCartao.get('limite')?.value,
        dataFechamentoFatura: this.formAdicionarCartao.get('dataFechamentoFatura')?.value,
        dataVencimentoFatura: this.formAdicionarCartao.get('dataVencimentoFatura')?.value,
        descricao: this.formAdicionarCartao.get('descricao')?.value,
      }

      this.service.AddCartoes(cartao, 'cartoes').subscribe(
        value => {
          this.listCartoes = [];
          this.listaCB = [];
          this.ngOnInit();
          console.log('success cartao!');
        },
        err => console.log('error')
      );
      return 'success'
    } else {
      alert('usuario nao logado');
      return false;
    }
  }

  getCartoes() {
    return this.service.GetCartoes().then(cartao => {
      // this.despesas = data;
      for (let i = 0; i < cartao.length; i++) {
        if(usersLogado.idPai && usersLogado.idPai !== ' '){
          if (cartao[i].uid === usersLogado.idPai) {
            this.listCartoes.push(cartao[i]);
            // this.listCartoes.push('_id', cartao[i._id]);
            console.log(this.listCartoes);
          }
        }else{
          if (cartao[i].uid === this.uidUserLS.uid) {
            this.listCartoes.push(cartao[i]);
            // this.listCartoes.push('_id', cartao[i._id]);
            console.log(this.listCartoes);
          }
        }
      }
      // return cartoes;
    });
  }
  addDespesaCC(id: string) {
    var user = firebase.default.auth().currentUser;
    this.listCartoes = [];
    if (user?.uid) {
      const despesaCartao: DespesaCC = {
        uid: usersLogado.idPai && usersLogado.idPai !== ' ' ? usersLogado.idPai : user?.uid,
        valor: this.formadicionarDespesaCC.get('valor')?.value,
        descricao: this.formadicionarDespesaCC.get('descricao')?.value,
        fixa: this.formadicionarDespesaCC.get('fixa')?.value,
        categoria: this.formadicionarDespesaCC.get('categoria')?.value,
        dataVencimento: this.formadicionarDespesaCC.get('dataVencimento')?.value,
        repetir: this.formadicionarDespesaCC.get('repetir')?.value,
        periodo: this.formadicionarDespesaCC.get('periodo')?.value,
        idCartao: id
      }
      this.service.AddDespesasCartao(despesaCartao).subscribe(
        value => {
          this.listCartoes = [];
          this.listaCB = [];
          this.ngOnInit();
          console.log('success');
        },
        err => console.log('error')
      );
      return 'success';
    } else {
      alert("usuario n logado");
      return false;
    }
  }
  editCartao(idCartao:any){
    this.deleteCc = idCartao;
    this.service.GetCartao(idCartao).subscribe(
      val => {
        this.formAdicionarCartao = this.formCC.group({
          nome: [val.nome],
          bandeira: [val.bandeira],
          banco: [val.banco],
          limite: [val.limite, Validators.compose([Validators.required])],
          dataFechamentoFatura: [val.dataFechamentoFatura.split('T')[0]],
          dataVencimentoFatura: [val.dataVencimentoFatura.split('T')[0]],
          descricao: [val.descricao]
        });
      },
      err => {

      }

    )
  }
  updateCartao(idCartao:any) {
    var user = firebase.default.auth().currentUser;

    const cartao: Cartao = {
      nome: this.formAdicionarCartao.get('nome')?.value,
      uid: usersLogado.idPai && usersLogado.idPai !== ' ' ? usersLogado.idPai : user?.uid,
      banco: this.formAdicionarCartao.get('banco')?.value,
      bandeira: this.formAdicionarCartao.get('bandeira')?.value,
      limite: this.formAdicionarCartao.get('limite')?.value,
      dataFechamentoFatura: this.formAdicionarCartao.get('dataFechamentoFatura')?.value,
      dataVencimentoFatura: this.formAdicionarCartao.get('dataVencimentoFatura')?.value,
      descricao: this.formAdicionarCartao.get('descricao')?.value,
    }

    this.service.UpdateCartoes(idCartao,cartao).subscribe(
      val => {
        this.listCartoes = [];
        this.listaCB = [];
        this.ngOnInit();

      }
    )
  }
  excluiCartaoInfo(idCartao:any, nomeCc: any,bandeiraCc:any,limiteCc:any){
    console.log(nomeCc);
    console.log(bandeiraCc);

    this.idDeleteCC = idCartao;
    this.nomeCc = nomeCc;
    this.bandeiraCc = bandeiraCc;
    this.limiteCc = limiteCc;

  }

  excluirCartao(idCartao:any){
    this.service.DeleteCartoes(idCartao).subscribe(
      val =>{
        this.successDelete = true;
        this.listCartoes = [];
        this.listaCB = [];
        this.ngOnInit();
      },
      err =>{
        this.errorDelete = true;
      }
    )
  }
  abrirModalAddDespesaCC(bandeira: string, id: string) {
    console.log(`bandeira ${bandeira}`);
    console.log(`_id ${id}`);
    this.bandeira = bandeira;
    this.idCC = id;
    this.exibirModalAddDespesasCC = true;
    console.log(`flag modal ${this.exibirModalAddDespesasCC}`);
  }

  exibirFatura(nomeCC: string, bandeiraCC: string, idCartao: string) {
    console.log(idCartao);
    this.despCC = [];
    this.bandeira = bandeiraCC;
    this.nomeCartao = nomeCC;
    this.service.GetDespesasCartao().then(desp => {
      // this.despesas = data;
      for (let i = 0; i < desp.length; i++) {
        if (desp[i].idCartao === idCartao) {
          this.despCC.push(desp[i]);
          // this.listCartoes.push('_id', cartao[i._id]);
          console.log('desps');
          console.log(this.despCC);
        } else {
          console.log("nenhuma compra para esse cartao!");
        }
      }
      // return cartoes;
    });
  }
  zerarVariaveis() {
    this.successDelete = false;
    this.errorDelete = false;
  }
}
