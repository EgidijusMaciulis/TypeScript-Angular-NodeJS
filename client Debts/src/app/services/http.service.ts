import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ContextService} from './context.service';
import {Debt} from '../models/Debt';

@Injectable()
export class HttpService {
  host: string;

  constructor(public http: HttpClient, public context: ContextService) {
    this.host = 'http://localhost:9090';
  }

  getUsers(): void {
    console.log('Bandome gauti vartotojus');

    this.http.get(`${this.host}/users`).subscribe({
      next: (response: any) => {
        console.log('Užklausa sėkminga', response);
      },
      error: (err: any) => {
        console.log('Užklausa nesėkminga', err);
      }
    });

    console.log('Tolimesnis kodas');
  }

  getUserDebts(): Observable<any> {
    let headers = new HttpHeaders();

    headers = headers.append('Authorization', `Bearer ${this.context.user.token}`);

    return this.http.get(`${this.host}/user/${this.context.user.id}/debt/`, {
      headers: headers
    });
  }

  login(email: string, password: string): Observable<any> {
    let body = {
      email: email,
      password: password
    };

    return this.http.post(`${this.host}/login`, body);
  }

  postUser(data: any): Observable<any> {
    return this.http.post(`${this.host}/user`, data);
  }

  searchUsers(fragment: string): Observable<any> {
    return this.http.get(`${this.host}/search/user/`, {
      params: {
        value: fragment
      }
    });
  }

  addDebt(debt: Debt): Observable<any> {
    return this.http.post(`${this.host}/user/debt`, debt, {
      headers: this.createAuthorizationHeader()
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    let headers = new HttpHeaders();
    return headers.append('Authorization', `Bearer ${this.context.user.token}`);
  }

  updateDebt(debtId: number, status: string): Observable<any> {
    return this.http.put(`${this.host}/debt/${debtId}`, {}, {
      headers: this.createAuthorizationHeader(),
      params: {
        action: status
      }
    });
  }

  deleteDebt(debtId: number): Observable<any> {
    return this.http.delete(`${this.host}/debt/${debtId}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  addFriend(userId: number): Observable<any> {
    return this.http.post(`${this.host}/friendship`, {userId}, {headers: this.createAuthorizationHeader()});
  }

}
