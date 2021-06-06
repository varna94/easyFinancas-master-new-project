import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import { Color, Label, monkeyPatchChartJsTooltip, MultiDataSet,monkeyPatchChartJsTooltip ,monkeyPatchChartJsLegend,MultiDataSet } from 'ng2-charts';
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

 pieChartOptions: ChartOptions;
 pieChartLabels: Label[] ;
 pieChartData: SingleDataSet;
 pieChartType: ChartType;
 pieChartLegend: boolean;
 pieChartPlugins: any;

  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(){
    this.lineChart();
    this.BarChartComponent();
  }
  lineChart(){
    this.lineChartData = [
        { data: [85, 72, 78, 75, 77, 75], label: 'Crude oil prices' },
      ];

      this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June'];

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
    this.doughnutChartLabels = ['BMW', 'Ford', 'Tesla'];
    this.doughnutChartData = [[55, 25, 20]];
    this.doughnutChartType = 'doughnut';
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

