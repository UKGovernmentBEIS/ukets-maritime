import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { UserStateDTO } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { KeycloakService } from '@core/services';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const originalConsole = console;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let page: Page;
  let authStore: AuthStore;

  const setUser: (roleType: UserStateDTO['roleType'], loginStatus?: UserStateDTO['status']) => void = (
    roleType,
    loginStatus?,
  ) => {
    authStore.setUserState({
      ...authStore.state.userState,
      status: loginStatus,
      roleType,
    });

    fixture.detectChanges();
  };

  class Page extends BasePage<AppComponent> {
    get footer() {
      return this.query<HTMLElement>('.govuk-footer');
    }

    get header() {
      return this.query<HTMLElement>('govuk-header');
    }

    get dashboardLink() {
      return this.query<HTMLAnchorElement>('govuk-service-navigation a[href="/maritime/dashboard"]');
    }

    get accountsLink() {
      return this.query<HTMLAnchorElement>('govuk-service-navigation a[href="/maritime/accounts"]');
    }

    get serviceAccessLink() {
      return this.query<HTMLAnchorElement>('govuk-service-navigation a[href="/maritime/service-access"]');
    }

    get templatesLink() {
      return this.query<HTMLAnchorElement>('govuk-service-navigation a[href="/maritime/templates"]');
    }

    get navLinks() {
      return this.queryAll<HTMLAnchorElement>('govuk-service-navigation .govuk-service-navigation__list a');
    }

    get breadcrumbs() {
      return this.queryAll<HTMLLIElement>('.govuk-breadcrumbs__list-item');
    }
  }

  beforeAll(() => {
    console.warn = vi.fn();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterAll(() => {
    console = originalConsole;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        KeycloakService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
        { provide: APP_BASE_HREF, useValue: '/maritime/' },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setIsLoggedIn(true);
    authStore.setUserState({ roleType: 'OPERATOR', status: 'NO_AUTHORITY' });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the footer', () => {
    expect(page.footer).toBeTruthy();
  });

  it('should not render the dashboard link for disabled users or an operator with no authority', () => {
    setUser('OPERATOR', 'NO_AUTHORITY');

    expect(page.dashboardLink).toBeFalsy();

    setUser('OPERATOR', 'ENABLED');

    expect(page.dashboardLink).toBeTruthy();

    setUser('REGULATOR', 'ENABLED');

    expect(page.dashboardLink).toBeTruthy();

    setUser('REGULATOR', 'DISABLED');

    expect(page.dashboardLink).toBeFalsy();
  });

  it('should render the service access link only if the user is a regulator or a verifier', () => {
    setUser('OPERATOR', 'NO_AUTHORITY');

    expect(page.serviceAccessLink).toBeFalsy();

    setUser('OPERATOR', 'ENABLED');

    expect(page.serviceAccessLink).toBeFalsy();

    setUser('VERIFIER', 'ENABLED');

    expect(page.serviceAccessLink).toBeTruthy();

    setUser('REGULATOR', 'ENABLED');

    expect(page.serviceAccessLink).toBeTruthy();
  });

  it('should render the accounts link only if the user is regulator, verifier or authorized operator', () => {
    setUser('OPERATOR', 'NO_AUTHORITY');

    expect(page.accountsLink).toBeFalsy();

    setUser('REGULATOR', 'ENABLED');

    expect(page.accountsLink).toBeTruthy();

    setUser('OPERATOR', 'ENABLED');

    expect(page.accountsLink).toBeTruthy();
  });

  it('should render the templates link only if the user is a regulator', () => {
    setUser('OPERATOR', 'ENABLED');

    expect(page.templatesLink).toBeFalsy();

    setUser('VERIFIER', 'ENABLED');

    expect(page.templatesLink).toBeFalsy();

    setUser('REGULATOR', 'ENABLED');

    expect(page.templatesLink).toBeTruthy();
  });

  it('should render the header with no navigation links if the user is disabled', () => {
    setUser('REGULATOR', 'ENABLED');
    expect(page.header).toBeTruthy();
    expect(page.navLinks.length).toBeGreaterThan(0);

    setUser('REGULATOR', 'DISABLED');
    fixture.detectChanges();

    expect(page.navLinks.length).toEqual(0);

    setUser('VERIFIER', 'TEMP_DISABLED');
    fixture.detectChanges();

    expect(page.navLinks.length).toEqual(0);
  });

  it('should compute the navigation items matching the user role', () => {
    setUser('OPERATOR', 'NO_AUTHORITY');

    expect(component.navigationItems()).toEqual([]);

    setUser('OPERATOR', 'ENABLED');

    expect(component.navigationItems().map((item) => item.text)).toEqual([
      'Tasks',
      'Accounts',
      'API data management',
      'Guidance',
    ]);

    setUser('VERIFIER', 'ENABLED');

    expect(component.navigationItems().map((item) => item.text)).toEqual([
      'Tasks',
      'Accounts',
      'Service access',
      'Guidance',
    ]);

    setUser('REGULATOR', 'ENABLED');

    expect(component.navigationItems().map((item) => item.text)).toEqual([
      'Tasks',
      'Accounts',
      'Service access',
      'Templates',
      'MI Reports',
      'Batch variations',
      'Guidance',
    ]);

    setUser('REGULATOR', 'DISABLED');

    expect(component.navigationItems()).toEqual([]);
  });

  it('should render no navigation links if the user is not logged in', () => {
    authStore.setIsLoggedIn(false);
    setUser('OPERATOR', 'NO_AUTHORITY');

    expect(page.navLinks.length).toEqual(0);

    authStore.setIsLoggedIn(true);
    setUser('OPERATOR', 'ENABLED');

    expect(page.navLinks.length).toBeGreaterThan(0);

    authStore.setIsLoggedIn(false);
    fixture.detectChanges();

    expect(page.navLinks.length).toEqual(0);
  });
});
