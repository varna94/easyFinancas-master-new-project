import { Conta } from './shared/services/dashboard';
import { SpinnerComponent } from './spinner/spinner.component';
import { ConfirmaEmailComponent } from './confirma-email/confirma-email.component';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { ModalFeedbacksComponent } from './modal-feedbacks/modal-feedbacks.component';
import { InicioComponent } from './inicio/inicio.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./shared/guard/auth.guard";
import { ContaComponent } from './conta/conta.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'feedback', component: ModalFeedbacksComponent },
  { path: 'recuperarSenha', component: RecuperarSenhaComponent },
  { path: 'confirmarEmail', component: ConfirmaEmailComponent },
  { path: 'spinner', component: SpinnerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
