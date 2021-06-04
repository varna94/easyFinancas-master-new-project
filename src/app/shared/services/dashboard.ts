import { CurrencyPipe } from '@angular/common';

export interface Conta {
  uid: any;
  nome: string;
  banco: string;
  saldo: string;
  totalDespesas: Number;
  tipo: string;
  descricao: string;
}
export interface Despesa {
  uid: any;
  valor: number;
  conta: string[];
  contaId: string;
  descricao: string;
  fixa: Boolean;
  status: string;
  categoria: string;
  dataVencimento: Date;
  repetir: Number;
  periodo: string;
}
export interface DespesaCC {
  uid: any;
  valor: string;
  descricao: string;
  fixa: Boolean;
  categoria: string;
  dataVencimento: Date;
  repetir: Number;
  periodo: string;
  idCartao: string;
}
export interface Recurso {
  uid: any;
  saldo: string;
  conta: string;
  contaId: string;
  descricao: string;
  recebido: Boolean;
  tipo: string;
  receitaFixa: Boolean;
  repetir: Number;
  periodo: string;
  dataRecebimento: Date;
}
export interface Cartao {
  uid: any;
  nome: string;
  bandeira: string;
  banco: string;
  limite: string;
  dataFechamentoFatura: Date;
  dataVencimentoFatura: Date;
  descricao: string;
}
export interface User {
  displayName: any;
  email: any;
  emailVerified: any;
  photoURL: any;
  uid: any;
}

export interface dataGe {

}
