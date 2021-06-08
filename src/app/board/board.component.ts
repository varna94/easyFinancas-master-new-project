import { ApiService } from './../../api.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import { Color, Label, monkeyPatchChartJsTooltip, MultiDataSet ,monkeyPatchChartJsLegend, SingleDataSet } from 'ng2-charts';
import { listaDespesas, DashboardComponent, usersLogado } from './../dashboard/dashboard.component';
import { convertUpdateArguments } from '@angular/compiler/src/compiler_util/expression_converter';

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
  categoria: Array<[string, any]> = [];
  showCategoria: any[]= [];
  listaCategoria: any[]=[];
  listaQtd: number[] =[];

  monthNames: Array<string> = ["Janeiro", "Fevereiro", "Maio", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  mesDespesas: string[] = [];
  auxMes: string[] = [];
  valoresDesp: any[] = [];

  constructor(public apService: ApiService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(){
    this.lineChart();
    this.BarChartComponent();
    this.DoughnutChartComponent();
    this.PieChartComponent();

    this.buscarDespesas();
    // interface showCategoria{
    //   categoria:string,
    //   qtd:number
    // }
  }

  buscarDespesas(){
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];


    this.uidUserLS = JSON.parse(localStorage.getItem("user") || '{}')
    const desp = this.apService.GetDespesas().then(data => {
      // this.despesas = data;
      for (let i = 0; i < data.length; i++) {
        if(usersLogado.idPai && usersLogado.idPai !== ' '){
          if (data[i].uid === usersLogado.idPai ) {
            this.despesas.push(data[i]);
            // console.log(data[i].dataVencimento);
            // console.log(new Date(data[i].dataVencimento).getMonth() + 1);
          }
        }else{
          if (data[i].uid === this.uidUserLS.uid) {
            this.despesas.push(data[i]);
            this.categoria.push(data[i].categoria);
            this.auxMes.push(monthNames[new Date(data[i].dataVencimento.replace('Z','')).getMonth()]);
            this.valoresDesp.push(data[i].valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) );
           console.log(data[i].valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

            // console.log(new Date(data[i].dataVencimento.replace('Z','')).getMonth() + 1);
            // console.log(this.monthNames[new Date(data[i].dataVencimento.replace('Z','')).getMonth()]);
          }
        }
      }
      this.mesDespesas = this.auxMes.filter((este:any, i:any) => this.auxMes.indexOf(este) === i);

      console.log(this.despesas);
      console.log(this.valoresDesp);
      console.log(this.mesDespesas);
      this.contagem(this.categoria);

      return data;
    });
  }
  contagem(categorias: Array<[string, any]>){
    categorias.sort();
      var current = null;
      var cnt = 0;
    // console.log(categorias);
      for (var i = 0; i < categorias.length; i++) {
          if (categorias[i] != current) {
              if (cnt > 0) {
                  // console.log(current + ' comes --> ' + cnt + ' times');
                  this.showCategoria.push({categoria:current,qts:cnt});

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
          // console.log(current + ' comes --> ' + cnt + ' times');
          this.showCategoria.push({categoria:current,qts:cnt});
           this.listaCategoria.push(current);
           this.listaQtd.push(cnt);
      }

      // console.log(this.listaQtd);
      // console.log(this.listaCategoria);
      // console.log(this.showCategoria);

  }

  lineChart(){
    this.lineChartData = [
        { data: [100,200,500,1000,5000], label: 'Crude oil prices' },
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
    this.barChartOptions = {
      responsive: true,
    };
    this.barChartLabels = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartPlugins = [];

    this.barChartData = [ { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' } ];
  }

  DoughnutChartComponent(){
    this.doughnutChartLabels = this.listaCategoria;
    this.doughnutChartData = [this.listaQtd];
    this.doughnutChartType = 'doughnut';

  }

  getRandomColor(){
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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

