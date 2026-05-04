// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';

// Add here your keycloak setup infos
const keycloakConfig: KeycloakConfig = {
  realm: 'uk-pmrv',
  clientId: 'uk-mrtm-web-app',
};

const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: 'check-sso',
  enableLogging: true,
  pkceMethod: 'S256',
};

const apiOptions = {
  baseUrl: '/maritime/api',
};

const timeoutBanner = {
  timeOffsetSeconds: 30,
};

export const environment = {
  production: true,
  keycloakConfig,
  keycloakInitOptions,
  apiOptions,
  timeoutBanner,
  supportMETSEmail: 'ukets-mets-support@energysecurity.gov.uk',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 * import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
 */
