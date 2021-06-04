import { emailVazioRec } from './../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {
  emailVazioRec: boolean;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.emailVazioRec = emailVazioRec;
    console.log(emailVazioRec);
  }
  emailRec() {
    this.emailVazioRec = false;
  }
}
