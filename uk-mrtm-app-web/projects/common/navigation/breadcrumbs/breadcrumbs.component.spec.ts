import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';

import { BreadcrumbsComponent } from './breadcrumbs.component';

@Component({
  standalone: true,
  template: '',
})
class PageComponent {}

@Component({
  imports: [BreadcrumbsComponent, RouterOutlet],
  standalone: true,
  template: '<netz-breadcrumbs /><router-outlet />',
})
class HostComponent {}

describe('BreadcrumbsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let router: Router;

  const links = () =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a')).map((a) => [
      a.textContent.trim(),
      a.getAttribute('href'),
    ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideRouter([
          {
            path: 'service-access',
            data: { breadcrumb: 'Service access' },
            children: [
              {
                path: 'regulator-users',
                data: {
                  breadcrumb: {
                    resolveText: () => 'Regulator users',
                    link: ['/service-access'],
                    fragment: 'regulator-users',
                  },
                },
                children: [
                  { path: 'add', component: PageComponent, data: { breadcrumb: false } },
                  { path: ':userId', component: PageComponent, data: { breadcrumb: 'User details' } },
                ],
              },
              {
                path: 'bodies/:id',
                data: { breadcrumb: { resolveText: () => 'Body 1', skipLink: false, fragment: 'contacts' } },
                children: [{ path: 'users/:userId', component: PageComponent, data: { breadcrumb: 'User' } }],
              },
              {
                path: 'accounts',
                data: { breadcrumb: 'Accounts' },
                children: [{ path: ':id', component: PageComponent, data: { breadcrumb: 'Account' } }],
              },
            ],
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  const navigate = async (url: string) => {
    await router.navigateByUrl(url);
    fixture.detectChanges();
  };

  it('should link a breadcrumb to its explicit link and fragment', async () => {
    await navigate('/service-access/regulator-users/5reg');

    expect(links()).toEqual([
      ['Service access', '/service-access'],
      ['Regulator users', '/service-access#regulator-users'],
    ]);
  });

  it('should keep the route url and add the fragment when the link must not be skipped', async () => {
    await navigate('/service-access/bodies/1/users/7');

    expect(links()).toEqual([
      ['Service access', '/service-access'],
      ['Body 1', '/service-access/bodies/1#contacts'],
    ]);
  });

  it('should link a breadcrumb without an explicit link to its route url', async () => {
    await navigate('/service-access/accounts/7');

    expect(links()).toEqual([
      ['Service access', '/service-access'],
      ['Accounts', '/service-access/accounts'],
    ]);
  });

  it('should hide the breadcrumbs when the active route opts out', async () => {
    await navigate('/service-access/regulator-users/add');

    expect(links()).toEqual([]);
  });
});
