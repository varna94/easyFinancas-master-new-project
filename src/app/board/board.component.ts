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
  listaCategoria: any[]=[];
  listaQtd: number[] =[];

  monthNames: Array<string> = ["Janeiro", "Fevereiro", "Maio", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  mesDespesas: string[] = [];
  auxMes: string[] = [];
  valoresDesp: any[] = [];

  resultado:any ;
  categoriaValorAgrupado: any;

  constructor(public apService: ApiService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(){
    // this.lineChart();
    this.buscarDespesas();

  }
  buscarDespesas(){
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    var tstCatValor = [{}];
    this.uidUserLS = JSON.parse(localStorage.getItem("user") || '{}')
    const desp = this.apService.GetDespesas().then(data => {
      // this.despesas = data;
      for (let i = 0; i < data.length; i++) {
        if(usersLogado.idPai && usersLogado.idPai !== ' '){
          if (data[i].uid === usersLogado.idPai ) {
            this.despesas.push(data[i]);
            tstCatValor.push({
              categoria:data[i].categoria,
              valor:data[i].valor
            });
          }
        }else{
          if (data[i].uid === this.uidUserLS.uid) {
            this.despesas.push(data[i]);
            tstCatValor.push({
              categoria:data[i].categoria,
              valor:data[i].valor
            });
            this.listaCategoria.push(data[i].categoria);
            this.auxMes.push(monthNames[new Date(data[i].dataVencimento.replace('Z','')).getMonth()]);
            this.valoresDesp.push(data[i].valor);

          }
        }
      }

      this.categoria = tstCatValor;
      this.categoriaValorAgrupado = this.agrupar(tstCatValor);

      console.log(this.categoriaValorAgrupado);

      this.mesDespesas = this.auxMes.filter((este:any, i:any) => this.auxMes.indexOf(este) === i);

      this.contagem(this.listaCategoria);
      // this.contagemValor(this.categoria, this.valoresDesp);

      this.BarChartComponent();
      this.DoughnutChartComponent();
      this.PieChartComponent();
      this.lineChart();

       console.log(this.despesas);

      // console.log(this.valoresDesp);
      // console.log(this.mesDespesas);

      return data;
    });

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

    // const total = itens.reduce((acumulador:any, { categoria, valor }) => {
    //   acumulador[categoria] = (acumulador[categoria] || 0) + valor;

    //   return acumulador;
    // }, {});

    // return Object.keys(total).map((categoria) => ({ categoria, valor: total[categoria] }));
  }

  // sortxx(tt:any){
  //   var sortable = [];
  //   for (var i in tt) {
  //     // console.log(tt);
  //       sortable.push([i, tt[i]]);

  //   }

  //  return sortable.sort(function(a, b) {
  //       return a[1] - b[1];
  //   });
  // }

  contagem(categorias: any){
    categorias.sort();
    console.log(categorias);
  //  var sortTeste = this.sortxx(categorias);
      var current = null;
      var cnt = 0;

    //  console.log(sortTeste);
      for (var i = 0; i < categorias.length; i++) {
          if (categorias[i] != current) {
              if (cnt > 0) {
                  // console.log(current + ' comes --> ' + cnt + ' times');
                  // this.showCategoria.push({categoria:current,qts:cnt});

                  this.listaCategoria.push(current);
                  this.listaQtd.push(cnt);
              }
              current = categorias[i];
              cnt = 1;

          } else {
              cnt++;
          }
      }


      if (cnt > 0) {
          //  console.log(current + ' comes --> ' + cnt + ' times');
          // this.showCategoria.push({categoria:current,qts:cnt});
           this.listaCategoria.push(current);
           this.listaQtd.push(cnt);
      }

  }
  // contagemValor(categorias: Array<[string, any]>, valores: any[]){
  //   categorias.sort();
  //     var current = null;
  //     var cnt = 0;
  //   // console.log(categorias);
  //     for (var i = 0; i < categorias.length; i++) {
  //         if (categorias[i] != current) {
  //             if (cnt > 0) {
  //                 // console.log(current + ' comes --> ' + cnt + ' times');

  //             }
  //             current = categorias[i];
  //             cnt = 1;

  //         } else {
  //             cnt++;
  //         }

  //     }

  //     if (cnt > 0) {
  //         // console.log(current + ' comes --> ' + cnt + ' times');

  //     }

  // }
  lineChart(){
    // var teste =  ['January', 'February', 'March', 'April', 'May', 'June'];

    this.lineChartData = [
        { data: this.valoresDesp, label: 'Crude oil prices' },
      ];

      this.lineChartLabels = this.mesDespesas;

      this.lineChartOptions = {
        responsive: true,
      };

      this.lineChartColors = [
        {
          borderColor: 'black',
          backgroundColor: 'rgba(255,255,0,0.28)',
        },
      ];

      this.lineChartLegend = true;
      this.lineChartPlugins = [];
      this.lineChartType = 'line';
  }

  filterMes(despMes: Array<string>){
    return despMes.filter((este, i) => despMes.indexOf(este) === i);
  }

  BarChartComponent (){
    var teste = this.mesDespesas;
    this.barChartOptions = {
      responsive: true,
    };
    this.barChartLabels = teste;
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartPlugins = [];

    this.barChartData = [ { data: this.categoriaValorAgrupado, label: 'Best Fruits' } ];
  }

  DoughnutChartComponent(){
    console.log(this.listaCategoria);
    this.doughnutChartLabels = this.listaCategoria;
    this.doughnutChartData = [this.listaQtd];
    this.doughnutChartType = 'doughnut';

  }

  // getRandomColor(){
  //   var letters = '0123456789ABCDEF'.split('');
  //   var color = '#';
  //   for (var i = 0; i < 6; i++ ) {
  //       color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }

  filtroCategoria(obj : any){
    var retornoLista;
    // obj.filter(())
    return retornoLista;
  }

  PieChartComponent(){
    this.pieChartOptions = {responsive: true};
    this.pieChartLabels = [['SciFi'], ['Drama'], 'Comedy'];
    this.pieChartData = [30, 50, 20];
    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
  }
}

