import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { UserAuthorityInfoDTO } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';
import { VerifierUsersTabComponent } from '@service-access/verifiers/verifier-users-tab/verifier-users-tab.component';

describe('VerifierUsersTabComponent', () => {
  let component: VerifierUsersTabComponent;
  let fixture: ComponentFixture<VerifierUsersTabComponent>;
  let page: Page;
  let store: VerifierUserStore;

  class Page extends BasePage<VerifierUsersTabComponent> {
    get heading() {
      return this.query<HTMLHeadingElement>('h2.govuk-heading-m');
    }

    get usersList() {
      return this.query<HTMLElement>('mrtm-verifier-users-list');
    }

    get rows() {
      return this.queryAll<HTMLTableRowElement>('tbody tr');
    }
  }

  const verifierUsers: UserAuthorityInfoDTO[] = [
    {
      userId: '1ver',
      firstName: 'Vera',
      lastName: 'Fier',
      roleCode: 'verifier_admin',
      authorityStatus: 'ACTIVE',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifierUsersTabComponent],
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    const authStore = TestBed.inject(AuthStore);
    authStore.setUserState({ status: 'ENABLED', roleType: 'VERIFIER', userId: '1ver' });

    store = TestBed.inject(VerifierUserStore);
    store.setState({
      ...store.getState(),
      verifierUsersList: { items: verifierUsers, editable: false },
    });

    fixture = TestBed.createComponent(VerifierUsersTabComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the verifier users tab content', () => {
    expect(page.heading.textContent.trim()).toEqual('Verifier users');
    expect(page.usersList).toBeTruthy();
    expect(page.rows.length).toEqual(verifierUsers.length);
  });
});
