import { senhaVazia, emailVazio } from './../../shared/services/auth.service';
import { Validacoes } from './../../validacoes';
import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  loginValido: any;
  senhaValida: any;
  emailVazio: boolean;
  senhaVazia: boolean;
  loginsCadastrados: string[] = [];
  constructor(private router: Router, private fb: FormBuilder, public authService: AuthService, public spinner: MatProgressSpinnerModule) {
    this.formLogin = this.fb.group({ login: [''], senha: [''] });
  }

  ngOnInit(): void {
    this.senhaVazia = senhaVazia;
    this.emailVazio = emailVazio;

    console.log(senhaVazia);
    console.log(emailVazio);
    this.criarFormLogin();

  }

  criarFormLogin() {
    this.formLogin = this.fb.group({
      loginEmail: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    console.log(this.formLogin.get('loginEmail')?.valid);
    console.log(this.formLogin.get('loginEmail')?.value);
  }

  cadastro() {
    this.router.navigate(['cadastro']);
  }
  verificaEmail(email: any) {
    console.log(email.currentTarget.value);
    if (email.currentTarget.value === '') {
      this.emailVazio = true;
    } else {
      this.emailVazio = false;
    }
  }
  verificaSenha(senha: any) {
    if (senha.currentTarget.value === '') {
      this.senhaVazia = true;
    } else {
      this.senhaVazia = false;
    }
  }

  get email() {
    return this.formLogin.get('loginEmail');
  }
  get senha() {
    return this.formLogin.get('senha');
  }
}

