export const environment = {
  production: false,
  fineractApiUrl: 'https://localhost:8443/fineract-provider',
  fineractApiBasePath: 'https://localhost:8443/fineract-provider/api/v1',
  oauth2: {
    issuer: 'https://localhost:8443/fineract-provider',
    clientId: 'frontend-client',
    redirectUri: 'http://localhost:4200/auth/callback',
    scopes: 'read write',
  },
  defaultTenant: 'default',
};
