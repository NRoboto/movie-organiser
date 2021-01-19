import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { ProfileDTO } from '@DTOs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  public userProfile$: Observable<ProfileDTO>;

  constructor(public readonly profileService: ProfileService) {
    this.userProfile$ = profileService.getProfile('alice');
  }

  ngOnInit(): void {}
}
