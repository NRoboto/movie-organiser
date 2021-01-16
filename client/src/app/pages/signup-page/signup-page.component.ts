import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
})
export class SignupPageComponent implements OnInit {
  public genders = ['Female', 'Male', 'Non-binary', 'Other...'] as const;

  public signupInfo: {
    username: string;
    password: string;
    age?: number;
    gender?: string;
    customGender?: string;
    location?: string;
  } = {
    username: '',
    password: '',
  };

  constructor() {}

  ngOnInit(): void {}

  signupSubmit() {
    console.log(this.signupInfo);
  }
}
