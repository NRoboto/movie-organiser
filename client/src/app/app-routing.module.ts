import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SigninPageComponent } from './pages/signin-page/signin-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { UserSettingsPageComponent } from './pages/user-settings-page/user-settings-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'signin', component: SigninPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'profile/:id', component: ProfilePageComponent },
  { path: 'profile/lists', component: ListsPageComponent },
  { path: 'profile/settings', component: UserSettingsPageComponent },
  { path: 'list/:id', component: ListPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: '**', component: Error404PageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
