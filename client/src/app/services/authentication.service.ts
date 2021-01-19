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
  private readonly currentTokenSource = new ReplaySubject<TokenDTO>(1);
  public readonly currentToken$ = this.currentTokenSource.asObservable();

  constructor(private readonly http: HttpClient) {}

  private setToken(token: Token) {
    console.log("Set token");
    
  private setToken(token: TokenDTO) {
    localStorage.setItem('token', JSON.stringify(token));
    this.currentTokenSource.next(token);
  }

  private clearToken() {
    localStorage.removeItem('token');
    this.currentTokenSource.next(undefined);
  }

  login(info: UserSigninReq) {
    return this.http
      .post<TokenDTO>(`${environment.apiUrl}login`, info)
      .pipe(map((token) => this.setToken(token)));
  }

  signup(info: UserSignupReq) {
    return this.http
      .post<TokenDTO>(`${environment.apiUrl}signup`, info)
      .pipe(map((token) => this.setToken(token)));
  }

  signout(token?: SignoutDTO) {
    if (!token) this.currentToken$.subscribe((x) => (token = x)).unsubscribe();

    return this.http.post<OkDTO>(`${environment.apiUrl}signout`, token).pipe(
      map((res) => {
        if (res.ok) this.clearToken();
      })
      );
  }

  signoutAll() {
    return this.http.post<OkDTO>(`${environment.apiUrl}signout/all`, {}).pipe(
      map((res) => {
        if (res.ok) this.clearToken();
      })
    );
  }
}
