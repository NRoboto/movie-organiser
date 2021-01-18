import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { Token, SignoutToken } from 'src/app/models/Token';
import { UserSignin, UserSignup } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly API_URL = 'http://localhost:3000/';
  private readonly currentTokenSource = new ReplaySubject<Token>(1);
  public readonly currentToken$ = this.currentTokenSource.asObservable();

  constructor(private readonly http: HttpClient) {}

  private setToken(token: Token) {
    console.log("Set token");
    
    localStorage.setItem('token', JSON.stringify(token));
    this.currentTokenSource.next(token);
  }

  private clearToken() {
    localStorage.removeItem("token");
    this.currentTokenSource.next(undefined);
  }

  login(info: UserSignin) {
    return this.http.post(`${this.API_URL}login`, info).pipe(
      map((res) => {
        const token = Token.fromResponse(res);
        if (token) this.setToken(token);
        return token;
      })
    );
  }

  signup(info: UserSignup) {
    return this.http.post(`${this.API_URL}signup`, info).pipe(
      map((res) => {
        const token = Token.fromResponse(res);
        if (token) this.setToken(token);
        return token;
      })
    );
  }

  signout(token?: SignoutToken) {
    if (!token)
      this.currentToken$.subscribe(x => token = x).unsubscribe();

    return this.http.post(`${this.API_URL}signout`, token).pipe(
      map((res: any) => {
        if (res?.ok) this.clearToken();
      })
      );
  }

  signoutAll() {
    return this.http.post(`${this.API_URL}signout/all`, {}).pipe(
      map((res: any) => {
        if (res?.ok) this.clearToken();
      })
    );
  }
}
