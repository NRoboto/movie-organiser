import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, first } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { UserSigninReq, UserSignupReq } from '../models/User';
import { environment } from 'src/environments/environment';
import { TokenDTO, OkDTO, SignoutDTO } from '@DTOs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly currentTokenSource = new ReplaySubject<TokenDTO>(1);
  public readonly currentToken$ = this.currentTokenSource.asObservable();

  private readonly authHeadersSource = new BehaviorSubject<
    HttpHeaders | undefined
  >(undefined);
  public readonly authHeaders$ = this.authHeadersSource.asObservable();

  constructor(private readonly http: HttpClient) {
    this.currentToken$.subscribe((token) =>
      this.authHeadersSource.next(
        new HttpHeaders().set('Authorization', 'Bearer ' + token.token)
      )
    );
  }

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
