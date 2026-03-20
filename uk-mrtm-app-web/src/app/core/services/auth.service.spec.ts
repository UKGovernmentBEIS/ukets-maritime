import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { firstValueFrom, of } from 'rxjs';

import {
  AuthoritiesService,
  TermsAndConditionsService,
  TermsDTO,
  UsersService,
  UserStateDTO,
  UserTermsVersionDTO,
} from '@mrtm/api';

import {
  AuthStore,
  initialState,
  selectIsLoggedIn,
  selectUser,
  selectUserProfile,
  selectUserState,
  selectUserTerms,
} from '@netz/common/auth';
import { ActivatedRouteSnapshotStub, mockClass } from '@netz/common/testing';

import { ConfigStore } from '@core/config';
import { AuthService, KeycloakService } from '@core/services';

describe('AuthService', () => {
  let service: AuthService;
  let authStore: AuthStore;
  let configStore: ConfigStore;
  let activatedRoute: ActivatedRoute;

  const keycloakService = mockClass(KeycloakService);
  keycloakService.logout.mockReturnValue(Promise.resolve());

  const user = {
    email: 'test@test.com',
    firstName: 'test',
    lastName: 'test',
    termsVersion: 1,
  };
  const userState: UserStateDTO = {
    status: 'ENABLED',
    roleType: 'OPERATOR',
    userId: 'opTestId',
  };

  const usersService: Partial<jest.Mocked<UsersService>> = {
    getCurrentUser: jest.fn().mockReturnValue(of(user)),
  };

  const authoritiesService: Partial<jest.Mocked<AuthoritiesService>> = {
    getCurrentUserState: jest.fn().mockReturnValue(of(userState)),
  };

  const latestTerms: TermsDTO = { url: '/test', version: 1 };
  const userTerms: UserTermsVersionDTO = { termsVersion: 1 };
  const termsService: Partial<jest.Mocked<TermsAndConditionsService>> = {
    getLatestTerms: jest.fn().mockReturnValue(of(latestTerms)),
    getUserTerms: jest.fn().mockReturnValue(of(userTerms)),
  };
  const baseHref = '/maritime/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: KeycloakService, useValue: keycloakService },
        { provide: UsersService, useValue: usersService },
        { provide: AuthoritiesService, useValue: authoritiesService },
        { provide: TermsAndConditionsService, useValue: termsService },
        { provide: APP_BASE_HREF, useValue: baseHref },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    service = TestBed.inject(AuthService);
    configStore = TestBed.inject(ConfigStore);
    activatedRoute = TestBed.inject(ActivatedRoute);
    keycloakService.loadUserProfile.mockResolvedValue({ email: 'test@test.com' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', async () => {
    await service.login();
    service.loadUser();

    expect(keycloakService.login).toHaveBeenCalledTimes(1);
    expect(keycloakService.login).toHaveBeenCalledWith({});
    expect(usersService.getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('should logout', async () => {
    await service.logout();

    expect(keycloakService.logout).toHaveBeenCalled();
  });

  it('should use different postLogoutRedirectUri depending on ui config', async () => {
    configStore.setState({
      ...configStore.getState(),
      features: { ...configStore.getState().features, serviceGatewayEnabled: false },
    });
    await service.logout();
    expect(keycloakService.logout).toHaveBeenCalledWith('http://localhost/maritime/');

    configStore.setState({
      ...configStore.getState(),
      features: { ...configStore.getState().features, serviceGatewayEnabled: true },
    });
    await service.logout();
    expect(keycloakService.logout).toHaveBeenCalledWith('http://localhost/maritime/');
  });

  it('should load and update user status', async () => {
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUserState))),
    ).resolves.toBeNull();
    await expect(firstValueFrom(service.loadUserState())).resolves.toEqual(userState);
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUserState))),
    ).resolves.toEqual(userState);
  });

  it('should update all user info when checkUser is called', async () => {
    expect(authStore.state).toEqual(initialState);
    (keycloakService.isAuthenticated as any) = false;

    await expect(firstValueFrom(service.checkUser())).resolves.toBeUndefined();

    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectIsLoggedIn))),
    ).resolves.toBeFalsy();
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUserState))),
    ).resolves.toBeNull();
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUserTerms))),
    ).resolves.toBeNull();
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUser))),
    ).resolves.toBeNull();
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUserProfile))),
    ).resolves.toBeNull();

    authStore.setIsLoggedIn(null);
    configStore.setState({ features: { terms: true } });
    (keycloakService.isAuthenticated as any) = true;

    await expect(firstValueFrom(service.checkUser())).resolves.toBeUndefined();

    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectIsLoggedIn))),
    ).resolves.toBeTruthy();
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUserState))),
    ).resolves.toEqual(userState);
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUserTerms))),
    ).resolves.toEqual(userTerms);
    await expect(firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUser)))).resolves.toEqual(
      user,
    );
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUserProfile))),
    ).resolves.toEqual({ email: 'test@test.com' });
  });

  it('should not update user info if logged in is already determined', async () => {
    authStore.setIsLoggedIn(false);
    const spy = jest.spyOn(service, 'loadUserState');

    await expect(firstValueFrom(service.checkUser())).resolves.toBeUndefined();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should redirect to origin if leaf data is blocking sign in redirect', async () => {
    (<any>activatedRoute.snapshot) = new ActivatedRouteSnapshotStub(undefined, undefined, {
      blockSignInRedirect: true,
    });

    await service.login();

    expect(keycloakService.login).toHaveBeenCalledTimes(1);
    expect(keycloakService.login).toHaveBeenCalledWith({ redirectUri: location.origin + baseHref });
  });
});
