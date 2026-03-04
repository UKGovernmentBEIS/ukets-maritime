import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { KeycloakService } from 'keycloak-angular';

import { AuthoritiesService, TermsAndConditionsService, UsersService, UserStateDTO } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import {
  mockAuthorityService,
  mockKeycloakService,
  mockTermsAndConditionsService,
  mockUsersService,
} from '@core/guards/core-guards.mock';
import { LandingPageComponent } from '@landing-page/landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let authStore: AuthStore;
  let page: Page;

  class Page extends BasePage<LandingPageComponent> {
    get pageHeadingContent() {
      return this.query<HTMLElement>('netz-page-heading').textContent.trim();
    }

    get paragraphContents() {
      return this.queryAll<HTMLElement>('p').map((item) => item.textContent.trim());
    }
  }

  const setUser = (roleType: UserStateDTO['roleType'], loginStatuses: UserStateDTO['status']) => {
    authStore.setUserState({ roleType, status: loginStatuses });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, LandingPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: KeycloakService, useValue: mockKeycloakService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthoritiesService, useValue: mockAuthorityService },
        { provide: TermsAndConditionsService, useValue: mockTermsAndConditionsService },
        { provide: APP_BASE_HREF, useValue: '/maritime/' },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setIsLoggedIn(false);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should show disabled message when role='REGULATOR' and status 'DISABLED'`, () => {
    authStore.setIsLoggedIn(true);
    setUser('REGULATOR', 'DISABLED');
    expect(page.pageHeadingContent).toEqual(
      'Your user account has been disabled. Please contact your admin to gain access to your account.',
    );
  });

  it(`should show ACCEPTED message when user login status is 'ACCEPTED'`, () => {
    authStore.setIsLoggedIn(true);
    setUser('OPERATOR', 'ACCEPTED');
    expect(page.pageHeadingContent).toEqual('Your user account needs to be activated.');
    expect(page.paragraphContents).toEqual([
      'Your user account must be activated before you can sign in to the Manage your UK Emissions Trading Scheme reporting service.',
      "If your account was created by your regulator, they will now activate your account. You'll receive an email once your account has been activated. Contact your regulator if your account has not been activated after 2 working days.",
    ]);
  });

  it('should display not registered when is logged in and no role type exist', () => {
    authStore.setIsLoggedIn(true);
    setUser(null, null);

    expect(page.pageHeadingContent).toEqual(
      'You need to create a sign in or contact your regulator or administrator to create a sign in for you.',
    );
  });
});
