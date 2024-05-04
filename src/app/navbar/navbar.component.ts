import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {OAuthService} from "angular-oauth2-oidc";

@Component({
  selector: 'tm-navbar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private oauthService: OAuthService) {

  }

  logout() {
    this.oauthService.logOut();
  }

}
