import { firestore } from 'firebase-admin';
import { urlPaiInfo } from './../../cadastro/cadastro.component';

// import { infoFeedback } from './../../app.component';
import { ModalFeedbacksComponent } from './../../modal-feedbacks/modal-feedbacks.component';
import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';
export let infoFeedback: { [key: string]: any };
export let senhaVazia: boolean;
export let emailVazio: boolean;
export let senhaVaziaCad: boolean;
export let emailVazioCad: boolean;
export let confEmailVazio: boolean;
export let nomeVazio: boolean;
export let emailVazioRec: boolean;
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  // emailVazio: boolean;
  // senhaVazia: boolean;
  examp: any;
  userUp: User;
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public feedback: ModalFeedbacksComponent,
    private _location: Location,
    public db: AngularFireDatabase
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user') || '{}');
      } else {
        localStorage.removeItem('user');
        // JSON.parse(localStorage.getItem('user') || '{}');
      }
    })
  }

  // Sign in with email/password
  SignIn(email: any, password: any) {
    this.router.navigate(['spinner']);
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result: any) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      }).catch((error: any) => {
        console.log(error);
        if (error.code === "auth/user-not-found") {
          infoFeedback = {
            tipo: 'Erro',
            titulo: 'Erro ao logar!',
            mensagem: 'Usuário não encontrado',
            acao: null
          }
          // this.feedback.renderFeedback('Erro', 'Erro ao logar!', 'Usuário não encotrado.', null);
          this.router.navigate(['feedback']);
        } else {
          emailVazio = true;
          senhaVazia = true;

          this.router.navigate(['login']);
          // this._location.back();
        }
        // window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(email: any, password: any, nome: any, depId: string , chilId: string) {
    var dt;
    var authRef = firebase.default.auth().currentUser;
    console.log('id Pai = '+depId);
    this.router.navigate(['spinner']);
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result: any) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        dt = result.user;
        const user: User = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: nome,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          idPai: depId ? depId : ' '
        }
        // result.user.displayName = nome;
        console.log(result);
        console.log(result.user);

        this.SendVerificationMail();
        this.SetUserData(result.user);
        this.createUserDB(user,depId,chilId);

      }).catch((error: any) => {
        emailVazioCad = true;
        senhaVaziaCad = true;
        confEmailVazio = true;
        nomeVazio = true;
        this.router.navigate(['cadastro']);
        console.log(error.message);
      })
  }

  createUserDB(data: any, idPai: string, idFilho: string) {
    console.log(data);
    console.log('id Pai = '+idPai);
    let userFilho = data as User;
    return new Promise<any>((resolver, rejeitar) => {
      this.afs
        .collection("User")
        .add(data)
        .then(res => {
          console.log(res);
          console.log('suceso')

          if(idPai){
            let rel = {
              idPai : idPai,
              idFilho : userFilho.uid
            }
            this.createDep(rel);
          }
        }, err => rejeitar())
        .catch((error: any) => {
          console.log(error);
        });
      console.log(data);
    });
  }

  createDep(rel :any){
    this.afs.collection('relacionamento').add(rel)
    .then( res => {
      console.log( 'Sucesso!');
    },
    err => {
      console.log(err);
    })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser.then(u => u?.sendEmailVerification()).then(() => {
      this.router.navigate(['confirmarEmail']);
    })
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: any) {
    this.router.navigate(['spinner']);
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        infoFeedback = {
          tipo: 'Success',
          titulo: 'Sucesso!',
          mensagem: 'Password reset email sent, check your inbox.',
          acao: null
        }
        // this.feedback.renderFeedback('Erro', 'Erro ao logar!', 'Usuário não encotrado.', null);
        this.router.navigate(['feedback']);
        console.log('Password reset email sent, check your inbox.');
      }).catch((error: any) => {
        if (error.code === 'auth/user-not-found') {
          infoFeedback = {
            tipo: 'Error',
            titulo: 'Erro!',
            mensagem: 'Usuário não encontrado!',
            acao: null
          }
          // this.feedback.renderFeedback('Erro', 'Erro ao logar!', 'Usuário não encotrado.', null);
          this.router.navigate(['feedback']);
        } else {
          emailVazioRec = true;
          // this.router.navigate(['recuperarSenha']);
          console.log(error);
          this.router.navigate(['recuperarSenha']);
        }

      })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    var provider = new firebase.default.auth.GoogleAuthProvider();
    firebase.default.auth().signInWithPopup(provider)
      .then((result) => {
        var token = result.credential as firebase.default.auth.OAuthCredential;
        var user = result.user;
        console.log(token);
        console.log(user);
        this.router.navigate(['dashboard']);

      }).catch(function (error) {
        alert('erro');
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {

    return this.afAuth.signInWithPopup(provider)

      .then((result: any) => {

        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
        this.SetUserData(result.user);
      }).catch((error: any) => {
        window.alert(error)
      })
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      idPai: user.idPai ? user.idPai : ''
    }
    return userRef.set(userData, {
      merge: true
    })
  }
  // get user info

  getContaInfo() {
    // console.log(this.afs.collection("User").snapshotChanges());
    return this.afs.collection("User").stateChanges();
  }

  getRelacionamento(){
    return this.afs.collection("relacionamento").stateChanges();
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {

      localStorage.removeItem('user');
      this.router.navigate(['']);
    })
  }


}
