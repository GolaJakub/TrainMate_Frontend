import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import {provideHttpClient} from "@angular/common/http";
import {AuthConfig, OAuthService, provideOAuthClient} from "angular-oauth2-oidc";
import {provideRouter} from "@angular/router";
import {routes} from "./app.routes";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {RoleGuard} from "./common/role-guard";
import {UserStateService} from "./users/user-state.service";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8123/realms/trainmate',
  tokenEndpoint: 'http://localhost:8123/realms/trainmate/protocol/openid-connect/token',
  redirectUri: window.location.origin,
  clientId: 'train-mate',
  responseType: 'code',
  scope: 'openid profile'
}

function initOAuth(oauthService: OAuthService, userStateService: UserStateService): () => Promise<boolean> {
  return () => {
    oauthService.configure(authConfig);
    oauthService.setupAutomaticSilentRefresh();
    return oauthService.loadDiscoveryDocumentAndLogin().then(loggedIn => {
      if (loggedIn) {
        userStateService.loadCurrentUser();
      }
      return loggedIn;
    });
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    NgbModule,
    {
      provide: APP_INITIALIZER,
      useFactory: initOAuth,
      multi: true,
      deps: [
        OAuthService,
        UserStateService
      ]
    }, provideAnimationsAsync(),
    RoleGuard

  ]
};
