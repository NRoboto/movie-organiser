import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProfileDTO } from '@DTOs';
import { UserPrivateProfileRes, UserPublicProfileRes } from '../models/User';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private readonly auth: AuthenticationService,
    private readonly http: HttpClient
  ) {}

  getProfile(username: string) {
    return this.auth.authHeaders$.pipe(
      switchMap((headers) =>
        this.http.get<ProfileDTO>(environment.apiUrl + `user/${username}`, {
          headers,
        })
      )
    );
  }

  getSelf() {}
}
