import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { UserStateDTO } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { mockRegulatorsRouteData } from '@service-access/regulators/testing/regulators-data.mock';
import { ServiceAccessComponent } from '@service-access/service-access.component';

describe('ServiceAccessComponent', () => {
  let component: ServiceAccessComponent;
  let fixture: ComponentFixture<ServiceAccessComponent>;
  let page: Page;

  class Page extends BasePage<ServiceAccessComponent> {
    get heading() {
      return this.query<HTMLHeadingElement>('h1.govuk-heading-xl');
    }

    get tabLinks() {
      return this.queryAll<HTMLAnchorElement>('.govuk-tabs__tab');
    }

    get tabLabels() {
      return this.tabLinks.map((tab) => tab.textContent.trim());
    }

    get tabFragments() {
      return this.tabLinks.map((tab) => tab.getAttribute('href').split('#')[1]);
    }

    get selectedTabLabel() {
      return this.query<HTMLElement>('.govuk-tabs__list-item--selected')?.textContent.trim();
    }

    get panel() {
      return this.query<HTMLElement>('.govuk-tabs__panel');
    }
  }

  const createComponent = async (roleType: UserStateDTO['roleType'], fragment?: string) => {
    await TestBed.configureTestingModule({
      imports: [ServiceAccessComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(null, null, structuredClone(mockRegulatorsRouteData), fragment),
        },
      ],
    }).compileComponents();

    const authStore = TestBed.inject(AuthStore);
    authStore.setUserState({ status: 'ENABLED', roleType, userId: '5reg' });

    fixture = TestBed.createComponent(ServiceAccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  describe('for regulators', () => {
    it('should create the component', async () => {
      await createComponent('REGULATOR');

      expect(component).toBeTruthy();
    });

    it('should render the title', async () => {
      await createComponent('REGULATOR');

      expect(page.heading).toBeTruthy();
      expect(page.heading.textContent.trim()).toEqual('Service access');
    });

    it('should render a fragment tab per regulator feature', async () => {
      await createComponent('REGULATOR');

      expect(page.tabLabels).toEqual([
        'Regulator users',
        'Site contacts',
        'External contacts',
        'Verification bodies',
        'Data suppliers',
      ]);
      expect(page.tabFragments).toEqual([
        'regulator-users',
        'site-contacts',
        'external-contacts',
        'verification-bodies',
        'data-suppliers',
      ]);
    });

    it('should show the first tab when the URL has no fragment', async () => {
      await createComponent('REGULATOR');

      expect(page.selectedTabLabel).toEqual('Regulator users');
      expect(page.panel.querySelector('mrtm-regulator-users-tab')).toBeTruthy();
    });

    it('should show the tab named by the URL fragment', async () => {
      await createComponent('REGULATOR', 'external-contacts');

      expect(page.selectedTabLabel).toEqual('External contacts');
      expect(page.panel.querySelector('mrtm-external-contacts-tab')).toBeTruthy();
      expect(page.panel.querySelector('mrtm-regulator-users-tab')).toBeFalsy();
    });
  });

  describe('for verifiers', () => {
    it('should render the title', async () => {
      await createComponent('VERIFIER');

      expect(page.heading).toBeTruthy();
      expect(page.heading.textContent.trim()).toEqual('Service access');
    });

    it('should render a fragment tab per verifier feature', async () => {
      await createComponent('VERIFIER');

      expect(page.tabLabels).toEqual(['Details', 'Verifier users', 'Site contacts', 'Data suppliers']);
      expect(page.tabFragments).toEqual(['details', 'verifier-users', 'site-contacts', 'data-suppliers']);
    });

    it('should show the tab named by the URL fragment', async () => {
      await createComponent('VERIFIER', 'verifier-users');

      expect(page.selectedTabLabel).toEqual('Verifier users');
      expect(page.panel.querySelector('mrtm-verifier-users-tab')).toBeTruthy();
    });
  });
});
