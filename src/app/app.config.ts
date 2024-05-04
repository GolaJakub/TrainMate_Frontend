import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {AuthConfig, OAuthService, provideOAuthClient} from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8123/realms/trainmate',
  tokenEndpoint: 'http://localhost:8123/realms/trainmate/protocol/openid-connect/token',
  redirectUri: window.location.origin,
  clientId: 'train-mate',
  responseType: 'code',
  scope: 'openid profile'
}

function initOAuth(oauthService: OAuthService): Promise<void> {
  return new Promise((resolve) => {
    oauthService.configure(authConfig);
    oauthService.setupAutomaticSilentRefresh();
    oauthService.loadDiscoveryDocumentAndLogin().then(() => resolve());
  })
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => {
          initOAuth(oauthService);
        }
      },
      multi: true,
      deps: [
        OAuthService,
      ]
    }

  ]
};
