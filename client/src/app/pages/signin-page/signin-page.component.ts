import { Component, OnInit } from '@angular/core';
import { UserSigninReq } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css'],
})
export class SigninPageComponent implements OnInit {
  public isInvalid = false;
  public loginInfo = { username: '', password: '' };

  constructor(
    private readonly auth: AuthenticationService,
    private readonly profile: ProfileService
  ) {}

  ngOnInit(): void {}

  loginSubmit() {
    const userLogin = new UserSigninReq(
      this.loginInfo.username,
      this.loginInfo.password
    );

    this.auth.login(userLogin).subscribe(
      (res) => {
        console.log('login response', res);
        this.profile.getProfile(userLogin.username).subscribe(console.log);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
