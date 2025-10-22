import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://keycloak.check-consulting.net/realms/scpi-realm',
  redirectUri: window.location.origin + '/dashboard',
  clientId: 'scpi-invest-front',
  responseType: 'code',
  scope: 'openid profile email roles',
  showDebugInformation: true,
  disableAtHashCheck: false,

  logoutUrl: 'https://keycloak.check-consulting.net/realms/scpi-realm/protocol/openid-connect/logout',
  postLogoutRedirectUri: window.location.origin,

  customQueryParams: {
    prompt: 'login'
  }
};
