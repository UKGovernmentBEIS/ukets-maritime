import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { KeycloakAngularModule, KeycloakOptions, KeycloakService } from 'keycloak-angular';
import { KeycloakConfig } from 'keycloak-js';

import { ApiModule, Configuration } from '@mrtm/api';

import { ConfigService } from '@core/config';
import { httpErrorInterceptor, pendingRequestInterceptor } from '@core/interceptors';
import { AuthService, GlobalErrorHandlingService } from '@core/services';
import { LatestTermsService } from '@core/services/latest-terms.service';
import { environment } from '@environments/environment';

import { APP_ROUTES, routerOptions } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (pl: PlatformLocation) => pl.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
    provideHttpClient(
      withInterceptors([httpErrorInterceptor, pendingRequestInterceptor]),
      // needed because KeycloakInterceptor is a Class Guard Injected in KeycloakAngularModule
      withInterceptorsFromDi(),
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      multi: true,
      deps: [AuthService, ConfigService, KeycloakService, LatestTermsService],
    },
    importProvidersFrom(
      ApiModule.forRoot(() => new Configuration({ basePath: environment.apiOptions.baseUrl })),
      KeycloakAngularModule,
    ),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlingService,
    },
    Title,
    provideRouter(
      APP_ROUTES,
      withRouterConfig(routerOptions),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
  ],
};

function init(
  authService: AuthService,
  configService: ConfigService,
  keycloakService: KeycloakService,
  latestTermsService: LatestTermsService,
) {
  return () =>
    firstValueFrom(configService.initConfigState())
      .then((state) => {
        const options: KeycloakOptions = {
          ...environment.keycloakOptions,
          config: {
            ...(environment.keycloakOptions.config as KeycloakConfig),
            url: state.keycloakServerUrl ?? (environment.keycloakOptions.config as KeycloakConfig).url,
          },
        };
        return keycloakService.init(options);
      })
      .catch((error) => console.error(error))
      .then(() => firstValueFrom(authService.checkUser()))
      .then(() => firstValueFrom(latestTermsService.initLatestTerms()))
      .catch((error) => console.error('[APP_INITIALIZE] init Keycloak failed', error));
}
