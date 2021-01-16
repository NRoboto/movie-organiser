import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css'],
})
export class SigninPageComponent implements OnInit {
  public isInvalid = false;
  public loginInfo = { username: '', password: '' };

  constructor() {}

  ngOnInit(): void {}

  loginSubmit() {
    console.log('Login info', this.loginInfo);
    this.isInvalid = !this.isInvalid;
  }
}
