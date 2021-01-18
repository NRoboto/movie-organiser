import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { SigninPageComponent } from './pages/signin-page/signin-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { FriendsPageComponent } from './pages/friends-page/friends-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { UserSettingsPageComponent } from './pages/user-settings-page/user-settings-page.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SignupPageComponent,
    SigninPageComponent,
    HomePageComponent,
    Error404PageComponent,
    ProfilePageComponent,
    FriendsPageComponent,
    ListPageComponent,
    ListsPageComponent,
    SearchPageComponent,
    UserSettingsPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
