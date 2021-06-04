import { Despesa, Conta, dataGe, Recurso, Cartao, DespesaCC } from './app/shared/services/dashboard';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { catchError, take, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class ApiService {

  endpoint: string = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // POST, GET, UPDATE, DELETE depesas
  AddDespesas(data: Despesa, table: string): Observable<any> {
    let API_URL = `${this.endpoint}/${table}`;

    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  GetDespesas(): Promise<any> {
    let API_URL = `${this.endpoint}/despesas`;

    return new Promise(resolve => {
      this.http.get(API_URL).pipe(
        take(1)).subscribe((data: any) => {
          // console.log(data);
          resolve(data);
        })
    })
  }

  GetDespesa(id: any): Observable<any> {
    let API_URL = `${this.endpoint}/despesas/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  UpdateDespesas(id: any, data: any): Observable<any> {
    let API_URL = `${this.endpoint}/despesas/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  DeleteDespesas(id: any): Observable<any> {
    var API_URL = `${this.endpoint}/despesas/${id}`;
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  // CONTAS
  AddContas(data: Conta, table: string): Observable<any> {
    let API_URL = `${this.endpoint}/${table}`;
    console.log(API_URL);
    console.log(data);
    console.log(table);

    return this.http.post(API_URL, data)
      .pipe(
        map((data) => console.log(data)),
        catchError(error => this.errorMgmt(error))
      )
  }
  GetConta(id: any): Observable<any> {
    let API_URL = `${this.endpoint}/contas/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  UpdateConta(id: any, data: any): Observable<any> {
    let API_URL = `${this.endpoint}/contas/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  GetContas(): Promise<any> {
    let API_URL = `${this.endpoint}/contas`;
    console.log(API_URL)
    return new Promise(resolve => {
      this.http.get(API_URL).pipe(
        take(1)).subscribe((data: any) => {
          console.log(data);
          resolve(data);

        }),
        (error: any) => {
          console.log(error);
        }
    })
  }
  DeleteConta(id: any): Observable<any> {
    var API_URL = `${this.endpoint}/contas/${id}`;
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }
  // RECURSOS
  // POST, GET, UPDATE, DELETE recursos
  Addrecursos(data: Recurso, table: string): Observable<any> {
    let API_URL = `${this.endpoint}/${table}`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  Getrecursos(): Promise<any> {
    let API_URL = `${this.endpoint}/recursos`;

    return new Promise(resolve => {
      this.http.get(API_URL).pipe(
        take(1)).subscribe((data: any) => {
          console.log(data);
          resolve(data);
        })
    })
  }

  GetRescurso(id: any): Observable<any> {
    let API_URL = `${this.endpoint}/recursos/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  Updaterecursos(id: any, data: any): Observable<any> {
    let API_URL = `${this.endpoint}/recursos/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  Deleterecursos(id: any): Observable<any> {
    var API_URL = `${this.endpoint}/recursos/${id}`;
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  // CARTAO CC
  // POST, GET, UPDATE, DELETE Cartoes
  AddCartoes(data: Cartao, table: string): Observable<any> {
    let API_URL = `${this.endpoint}/${table}`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  GetCartoes(): Promise<any> {
    let API_URL = `${this.endpoint}/cartoes`;

    return new Promise(resolve => {
      this.http.get(API_URL).pipe(
        take(1)).subscribe((data: any) => {
          console.log(data);
          resolve(data);
        })
    })
  }

  GetCartao(id: any): Observable<any> {
    let API_URL = `${this.endpoint}/cartoes/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  UpdateCartoes(id: any, data: any): Observable<any> {
    let API_URL = `${this.endpoint}/cartoes/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  DeleteCartoes(id: any): Observable<any> {
    var API_URL = `${this.endpoint}/cartoes/${id}`;
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }
  // DESPESA CARTAO
  // POST, GET, UPDATE, DELETE Cartoes
  AddDespesasCartao(data: DespesaCC): Observable<any> {
    let API_URL = `${this.endpoint}/depesaCC`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  GetDespesasCartao(): Promise<any> {
    let API_URL = `${this.endpoint}/depesaCC`;

    return new Promise(resolve => {
      this.http.get(API_URL).pipe(
        take(1)).subscribe((data: any) => {
          console.log(data);
          resolve(data);
        })
    })
  }

  GetDespesaCartao(id: any): Observable<any> {
    let API_URL = `${this.endpoint}/depesaCC/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  UpdateDespesasCartao(id: any, data: any): Observable<any> {
    let API_URL = `${this.endpoint}/depesaCC/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }
}
