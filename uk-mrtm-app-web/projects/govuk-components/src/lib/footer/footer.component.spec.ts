import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GovukFooterComponent } from './footer.component';

describe('GovukFooterComponent', () => {
  let component: GovukFooterComponent;
  let fixture: ComponentFixture<GovukFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukFooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovukFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const element = (): HTMLElement => fixture.nativeElement;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should carry the footer class on the host and render the crown logo', () => {
    expect(element().classList).toContain('govuk-footer');
    expect(element().querySelector('.govuk-width-container > svg.govuk-footer__crown')).toBeTruthy();
  });

  it('should render the licence notice and the copyright link', () => {
    const licence = element().querySelector('.govuk-footer__licence-description');
    const copyright = element().querySelector<HTMLAnchorElement>('.govuk-footer__copyright-logo');

    expect(element().querySelector('svg.govuk-footer__licence-logo')).toBeTruthy();
    expect(licence.textContent).toContain('Open Government Licence v3.0');
    expect(copyright.textContent.trim()).toEqual('© Crown copyright');
    expect(copyright.classList).toContain('govuk-footer__link');
  });

  it('should hide the licence notice when showContentLicence is false', () => {
    fixture.componentRef.setInput('showContentLicence', false);
    fixture.detectChanges();

    expect(element().querySelector('.govuk-footer__licence-description')).toBeFalsy();
    expect(element().querySelector('.govuk-footer__copyright-logo')).toBeTruthy();
  });

  it('should render the meta links as an inline list', () => {
    fixture.componentRef.setInput('meta', [
      { text: 'Cookies', routerLink: '/cookies' },
      { text: 'Contact us', href: '/contact-us' },
    ]);
    fixture.detectChanges();

    const items = Array.from(element().querySelectorAll('.govuk-footer__inline-list > li'));

    expect(element().querySelector('.govuk-visually-hidden').textContent).toEqual('Support links');
    expect(items.map((item) => item.className)).toEqual([
      'govuk-footer__inline-list-item',
      'govuk-footer__inline-list-item',
    ]);
    expect(items.map((item) => item.querySelector('a').className)).toEqual([
      'govuk-footer__link',
      'govuk-footer__link',
    ]);
    expect(items[0].querySelector('a').getAttribute('href')).toEqual('/cookies');
    expect(items[1].querySelector('a').getAttribute('href')).toEqual('/contact-us');
  });

  it('should render the navigation sections with a section break', () => {
    fixture.componentRef.setInput('navigation', [
      { title: 'Services', items: [{ text: 'Service one', routerLink: '/one' }], columns: 2 },
    ]);
    fixture.detectChanges();

    const section = element().querySelector('.govuk-footer__navigation > .govuk-footer__section');

    expect(section.classList).toContain('govuk-grid-column-full');
    expect(section.querySelector('.govuk-footer__heading').textContent).toEqual('Services');
    expect(section.querySelector('ul').classList).toContain('govuk-footer__list--columns-2');
    expect(section.querySelector('li').className).toEqual('govuk-footer__list-item');
    expect(section.querySelector('li > a').className).toEqual('govuk-footer__link');
    expect(element().querySelector('hr.govuk-footer__section-break')).toBeTruthy();
  });
});
