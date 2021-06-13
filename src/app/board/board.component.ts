import { infoFeedback } from './../shared/services/auth.service';
import { ApiService } from './../../api.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import { Color, Label, monkeyPatchChartJsTooltip, MultiDataSet ,monkeyPatchChartJsLegend, SingleDataSet } from 'ng2-charts';
import { listaDespesas, DashboardComponent, usersLogado } from './../dashboard/dashboard.component';
import { convertUpdateArguments } from '@angular/compiler/src/compiler_util/expression_converter';
import { CompileMetadataResolver } from '@angular/compiler';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  lineChartData: ChartDataSets[];
  lineChartLabels: Label[];
  lineChartColors: Color[];
  lineChartOptions: any;
  lineChartLegend: boolean;
  lineChartPlugins: any;
  lineChartType: any;

  barChartOptions: ChartOptions ;
  barChartLabels: Label[];
  barChartType: ChartType;
  barChartLegend : boolean;
  barChartPlugins : any;
  barChartData: ChartDataSets[];

  doughnutChartLabels: Label[];
  doughnutChartType: ChartType;
  doughnutChartData: MultiDataSet;
  doughnutBackgroundColor: Color;

  pieChartOptions: ChartOptions;
  pieChartLabels: Label[] ;
  pieChartData: SingleDataSet;
  pieChartType: ChartType;
  pieChartLegend: boolean;
  pieChartPlugins: any;

  public despesas: Array<[string, any]> = [];
  uidUserLS:any;
  categoria: any;
  showCategoria: any[]= [];
  listaCategoria: string[]=[];
  listaCategoriaChart: string[]=[];
  listaQtd: number[] =[];

  monthNames: Array<string> = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  mesDespesas: string[] = [];
  auxMes: string[] = [];
  valoresDesp: any[] = [];

  resultado:any ;
  categoriaValorAgrupado: any;
  listCategoriaValor: string[] = [];
  listValorCategoria: any[] = [];
  despesaMensal: any;

  listMes: string[] = [];
  listvalorMes : any[] = [];

  showTotalMes : boolean;
  showQtdCategoria : boolean;
  showTotalDespesaCategoria: boolean;

  constructor(public apService: ApiService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(){

    this.buscarDespesas();

  }
  buscarDespesas(){

    var tstCatValor = [{}];
    var valorPorMes = [{}];
    this.uidUserLS = JSON.parse(localStorage.getItem("user") || '{}');

    const desp = this.apService.GetDespesas().then(data => {

      for (let i = 0; i < data.length; i++) {
        if(usersLogado.idPai && usersLogado.idPai !== ' '){
          if (data[i].uid === usersLogado.idPai ) {
            this.despesas.push(data[i]);
            tstCatValor.push({
              categoria:data[i].categoria,
              valor:data[i].valor
            });

            valorPorMes.push({
              mesNum: new Date(data[i].dataVencimento.replace('Z','')).getMonth(),
              mes:this.monthNames[new Date(data[i].dataVencimento.replace('Z','')).getMonth()],
              valor:data[i].valor
            });

            this.listaCategoria.push(data[i].categoria);
            this.auxMes.push(this.monthNames[new Date(data[i].dataVencimento.replace('Z','')).getMonth()]);
            this.valoresDesp.push(data[i].valor);
          }
        }else{
          if (data[i].uid === this.uidUserLS.uid) {
            this.despesas.push(data[i]);
            tstCatValor.push({
              categoria:data[i].categoria,
              valor:data[i].valor
            });

            valorPorMes.push({
              mesNum: new Date(data[i].dataVencimento.replace('Z','')).getMonth(),
              mes:this.monthNames[new Date(data[i].dataVencimento.replace('Z','')).getMonth()],
              valor:data[i].valor
            });

            this.listaCategoria.push(data[i].categoria);
            this.auxMes.push(this.monthNames[new Date(data[i].dataVencimento.replace('Z','')).getMonth()]);
            this.valoresDesp.push(data[i].valor);

          }
        }
      }

      this.categoria = tstCatValor;
      this.categoriaValorAgrupado = this.agrupar(tstCatValor);
      this.despesaMensal = this.agruparValorMensal(valorPorMes.sort((a:any, b:any) => a.mesNum < b.mesNum ? -1 : a.mesNum > b.mesNum ? 1 : 0));

      this.filterCategoriaValor(this.categoriaValorAgrupado);
      this.filterMesValor(this.despesaMensal);
      this.contagem(this.listaCategoria);

      this.showQtdCategoria = true;
      this.DoughnutChartComponent();

      // return data;
    });
    //
  }

  filterMesValor(categoria: any){
    console.log('func filter - '+categoria)
    var listames: string[]= [];
    var listaValor: any[] = [];

    categoria.filter(function(cate:any){
      console.log( cate.mes != undefined);
      if(cate.mes){
        listames.push(cate.mes);
        listaValor.push(cate.valor.toFixed(2));
      }
      return cate.mes != undefined;
    });

    this.listMes = listames;
    this.listvalorMes = listaValor;
    console.log('mes - '+this.listMes );
    console.log('valores - '+this.listvalorMes);
  }

  filterCategoriaValor(categoria: any){
    var listaCateteste: string[]= [];
    var listaValorCate: any[] = [];

     categoria.filter(function(cate:any){
      console.log( cate.categoria != undefined);
      if(cate.categoria){
        listaCateteste.push(cate.categoria);
        listaValorCate.push(cate.valor.toFixed(2));
      }
      return cate.categoria != undefined;
    } );
    this.listCategoriaValor = listaCateteste;
    this.listValorCategoria = listaValorCate;
  }

  agruparValorMensal(antigo:any){

    var resul: any = [];

    antigo.reduce(function(novo:any, item:any) {
      if (!novo[item.mes]) {
        novo[item.mes] = {
          valor: 0,
          mes: item.mes
        };
         resul.push(novo[item.mes]);
      }
      novo[item.mes].valor += item.valor;
      return novo;
    }, {});
    // this.resultado = resul;
    console.log(resul);
    return resul;

  }

  agrupar(antigo:any){
    var resul: any = [];
    antigo.reduce(function(novo:any, item:any) {
      if (!novo[item.categoria]) {
        novo[item.categoria] = {
          valor: 0,
          categoria: item.categoria
        };
         resul.push(novo[item.categoria]);
      }
      novo[item.categoria].valor += item.valor;
      return novo;
    }, {});
    this.resultado = resul;
    console.log(resul);
    return this.resultado;

  }

  contagem(categorias: string[]){
    categorias.sort();
    var current = '';
    var cnt = 0;
      for (var i = 0; i < categorias.length; i++) {
          if (categorias[i] != current) {
              if (cnt > 0) {
                  // this.showCategoria.push({categoria:current,qts:cnt});
                  this.listaCategoriaChart.push(current);
                  this.listaQtd.push(cnt);
              }
              current = categorias[i];
              cnt = 1;

          } else {
              cnt++;
          }
      }
      if (cnt > 0) {
           this.listaCategoriaChart.push(current);
           this.listaQtd.push(cnt);
      }
  }

  lineChart(){
    this.lineChartData = [
        { data: this.listvalorMes},
      ];
      this.lineChartLabels = this.listMes;

      this.lineChartOptions = {
        responsive: true,
      };

      this.lineChartColors = [
        {
          borderColor: 'black',
          backgroundColor: 'rgba(255,255,0,0.28)',
        },
      ];

      this.lineChartLegend = false;
      this.lineChartPlugins = [];
      this.lineChartType = 'line';
  }

  BarChartComponent (){
    this.barChartOptions = {
      responsive: true,
    };
    this.barChartLabels =  this.listCategoriaValor;
    this.barChartType = 'bar';
    this.barChartLegend = false;
    this.barChartPlugins = [];
    this.barChartData = [ { data: this.listValorCategoria} ];
  }

  DoughnutChartComponent(){
    this.doughnutChartLabels = this.listaCategoriaChart;
    this.doughnutChartData = [this.listaQtd];
    this.doughnutChartType = 'doughnut';

  }

  tipoGrafico(val:any){
    if(val.value === 'total-mes'){
      this.lineChart();
      this.showTotalMes = true;
      this.showQtdCategoria = false;
      this.showTotalDespesaCategoria = false;
    }else if(val.value === 'qtd-categoria'){

      this.DoughnutChartComponent();
      this.showTotalMes = false;
      this.showQtdCategoria = true;
      this.showTotalDespesaCategoria = false;
    }else if(val.value === 'total-despesa-categoria'){
      this.BarChartComponent();
      this.showTotalMes = false;
      this.showQtdCategoria = false;
      this.showTotalDespesaCategoria = true;
    }

  }
}

