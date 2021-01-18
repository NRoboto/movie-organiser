import { Component, OnInit } from '@angular/core';
import { UserSignin } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css'],
})
export class SigninPageComponent implements OnInit {
  public isInvalid = false;
  public loginInfo = { username: '', password: '' };

  constructor(private readonly auth: AuthenticationService) {}

  ngOnInit(): void {}

  async loginSubmit() {
    const userLogin = new UserSignin(
      this.loginInfo.username,
      this.loginInfo.password
    );

    try {
      this.auth.login(userLogin).subscribe((res) => {
        console.log("login response", res);
      }, (err) => {
        console.error(err);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
