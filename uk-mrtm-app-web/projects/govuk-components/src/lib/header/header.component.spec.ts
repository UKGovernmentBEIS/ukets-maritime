import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GovukHeaderComponent } from './header.component';

describe('GovukHeaderComponent', () => {
  let component: GovukHeaderComponent;
  let fixture: ComponentFixture<GovukHeaderComponent>;

  const element = (): HTMLElement => fixture.nativeElement;
  const homepageLink = (): HTMLAnchorElement => element().querySelector('.govuk-header__homepage-link');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should carry the header class on the host and render the logotype', () => {
    expect(element().classList).toContain('govuk-header');
    expect(element().querySelector('svg.govuk-header__logotype')).toBeTruthy();
    expect(homepageLink().getAttribute('aria-label')).toBeNull();
  });

  it('should render the container with the width container class', () => {
    const container = element().querySelector('.govuk-header__container');
    expect(container).toBeTruthy();
    expect(container.classList).toContain('govuk-width-container');
  });

  it('should link the logo to gov.uk by default', () => {
    expect(homepageLink().getAttribute('href')).toBe('//gov.uk');
  });

  it('should link the logo to an external homepage href', () => {
    fixture.componentRef.setInput('homepage', { href: 'https://www.gov.uk' });
    fixture.detectChanges();

    expect(homepageLink().getAttribute('href')).toBe('https://www.gov.uk');
  });

  it('should link the logo with routerLink for an internal homepage', () => {
    fixture.componentRef.setInput('homepage', { routerLink: '/landing' });
    fixture.detectChanges();

    expect(homepageLink().getAttribute('href')).toBe('/landing');
  });

  it('should render the product name only when provided', () => {
    expect(element().querySelector('.govuk-header__product-name')).toBeNull();

    fixture.componentRef.setInput('productName', 'Test Product');
    fixture.detectChanges();

    expect(element().querySelector('.govuk-header__product-name').textContent).toContain('Test Product');
  });

  it('should render the projected links in the actions area', async () => {
    @Component({
      imports: [GovukHeaderComponent],
      standalone: true,
      template: `
        <govuk-header>
          <a class="govuk-link" href="/change-service">Change service</a>
          <a class="govuk-link" href="/sign-out">Sign out</a>
        </govuk-header>
      `,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const actions = (hostFixture.nativeElement as HTMLElement).querySelector('.govuk-header__actions');
    expect(Array.from(actions.querySelectorAll('a')).map((link) => link.textContent)).toEqual([
      'Change service',
      'Sign out',
    ]);
  });
});
