import { Component, OnInit } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Platform } from '@angular/cdk/platform';
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
