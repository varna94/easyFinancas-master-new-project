import { Component } from '@angular/core';

export let infoFeedback: { [key: string]: any };
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'easyFinancas';
}

