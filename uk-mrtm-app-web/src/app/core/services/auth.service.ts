import { APP_BASE_HREF } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions, KeycloakProfile } from 'keycloak-js';

import {
  AuthoritiesService,
  TermsAndConditionsService,
  UserDTO,
  UsersService,
  UserStateDTO,
  UserTermsVersionDTO,
} from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';

import { ConfigStore, selectIsFeatureEnabled } from '@core/config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authStore = inject(AuthStore);
  private readonly configStore = inject(ConfigStore);
  private readonly keycloakService = inject(KeycloakService);
  private readonly usersService = inject(UsersService);
  private readonly authorityService = inject(AuthoritiesService);
  private readonly termsAndConditionsService = inject(TermsAndConditionsService);
  private readonly route = inject(ActivatedRoute);
  private baseHref = inject(APP_BASE_HREF);

  private readonly _baseRedirectUri = new URL(this.baseHref, location.origin).toString();

  get baseRedirectUri() {
    return this._baseRedirectUri;
  }

  login(options?: KeycloakLoginOptions): Promise<void> {
    let leaf = this.route.snapshot;

    while (leaf.firstChild) {
      leaf = leaf.firstChild;
    }

    return this.keycloakService.login({
      ...options,
      ...(leaf.data?.blockSignInRedirect ? { redirectUri: this._baseRedirectUri } : null),
    });
  }

  logout(redirectPath?: string): Promise<void> {
    return this.keycloakService.logout(redirectPath ?? this._baseRedirectUri).then(() => {
      this.authStore.setIsLoggedIn(false);
    });
  }

  loadUser(): Observable<UserDTO> {
    return this.usersService.getCurrentUser().pipe(tap((user) => this.authStore.setUser(user)));
  }

  loadUserState(): Observable<UserStateDTO> {
    return this.authorityService.getCurrentUserState().pipe(tap((userState) => this.authStore.setUserState(userState)));
  }

  checkUser(): Observable<void> {
    return this.authStore.state.isLoggedIn === null
      ? this.loadIsLoggedIn().pipe(
          switchMap((res: boolean) =>
            res
              ? combineLatest([
                  this.loadUserState(),
                  this.loadUserTerms(),
                  this.loadUser(),
                  this.loadUserProfile(),
                ]).pipe(map(() => undefined))
              : of(undefined),
          ),
        )
      : of(undefined);
  }

  loadUserProfile(): Observable<KeycloakProfile> {
    return from(this.keycloakService.loadUserProfile()).pipe(tap((profile) => this.authStore.setUserProfile(profile)));
  }

  loadUserTerms(): Observable<UserTermsVersionDTO> {
    return this.configStore.pipe(selectIsFeatureEnabled('terms')).pipe(
      switchMap((termsEnabled) => (termsEnabled ? this.termsAndConditionsService.getUserTerms() : of(null))),
      tap((userTerms) => this.authStore.setUserTerms(userTerms)),
    );
  }

  loadIsLoggedIn(): Observable<boolean> {
    return of(this.keycloakService.isLoggedIn()).pipe(tap((isLoggedIn) => this.authStore.setIsLoggedIn(isLoggedIn)));
  }

  constructRedirectUri(path: string): string {
    return new URL(path, this._baseRedirectUri).toString();
  }
}
