import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GovukServiceNavigationComponent } from './service-navigation.component';

describe('GovukServiceNavigationComponent', () => {
  let component: GovukServiceNavigationComponent;
  let fixture: ComponentFixture<GovukServiceNavigationComponent>;
  let isDesktopViewport: boolean;

  const element = (): HTMLElement => fixture.nativeElement;
  const toggleButton = (): HTMLButtonElement => element().querySelector('.govuk-service-navigation__toggle');
  const navigationList = (): HTMLUListElement => element().querySelector('.govuk-service-navigation__list');

  const createComponent = (): void => {
    fixture = TestBed.createComponent(GovukServiceNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: isDesktopViewport,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  beforeEach(async () => {
    isDesktopViewport = true;

    await TestBed.configureTestingModule({
      imports: [GovukServiceNavigationComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    createComponent();

    expect(component.ariaLabel()).toBe('Service information');
    expect(component.menuButtonText()).toBe('Menu');
    expect(component.menuButtonLabel()).toBeUndefined();
    expect(component.navigationId()).toBe('navigation');
    expect(component.navigationLabel()).toBeUndefined();
    expect(component.collapseOnMobile()).toBeUndefined();
  });

  it('should mark the host as a labelled region only when a service name is provided', () => {
    createComponent();

    expect(element().getAttribute('role')).toBeNull();
    expect(element().getAttribute('aria-label')).toBeNull();

    fixture.componentRef.setInput('serviceName', 'Test Service');
    fixture.detectChanges();

    expect(element().getAttribute('role')).toBe('region');
    expect(element().getAttribute('aria-label')).toBe('Service information');
  });

  it('should render the service name as text when no homepage is provided', () => {
    createComponent();
    fixture.componentRef.setInput('serviceName', 'Test Service');
    fixture.detectChanges();

    const serviceNameElement = element().querySelector('.govuk-service-navigation__service-name');
    expect(serviceNameElement.textContent).toContain('Test Service');
    expect(serviceNameElement.querySelector('a')).toBeNull();
  });

  it('should render the service name as a link when the homepage is an href', () => {
    createComponent();
    fixture.componentRef.setInput('serviceName', 'Test Service');
    fixture.componentRef.setInput('serviceHomepage', { href: 'https://www.gov.uk' });
    fixture.detectChanges();

    const serviceNameLink = element().querySelector('.govuk-service-navigation__service-name a');
    expect(serviceNameLink.textContent).toContain('Test Service');
    expect(serviceNameLink.getAttribute('href')).toBe('https://www.gov.uk');
  });

  it('should render the service name with routerLink when the homepage is internal', () => {
    createComponent();
    fixture.componentRef.setInput('serviceName', 'Test Service');
    fixture.componentRef.setInput('serviceHomepage', { routerLink: '/home' });
    fixture.detectChanges();

    const serviceNameLink = element().querySelector('.govuk-service-navigation__service-name a');
    expect(serviceNameLink.textContent).toContain('Test Service');
    expect(serviceNameLink.getAttribute('href')).toBe('/home');
  });

  it('should render navigation items when provided', () => {
    createComponent();
    fixture.componentRef.setInput('navigation', [
      { routerLink: '/page-1', text: 'Page 1' },
      { routerLink: '/page-2', text: 'Page 2' },
    ]);
    fixture.detectChanges();

    const items = element().querySelectorAll('.govuk-service-navigation__item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Page 1');
    expect(items[1].textContent).toContain('Page 2');

    const links = element().querySelectorAll('.govuk-service-navigation__link');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('/page-1');
    expect(links[1].getAttribute('href')).toBe('/page-2');
  });

  it('should label the navigation with navigationLabel, falling back to menuButtonText', () => {
    createComponent();
    fixture.componentRef.setInput('navigation', [{ routerLink: '/page-1', text: 'Page 1' }]);
    fixture.componentRef.setInput('menuButtonText', 'Menu di navigazione');
    fixture.detectChanges();

    const nav = element().querySelector('.govuk-service-navigation__wrapper');
    expect(nav.getAttribute('aria-label')).toBe('Menu di navigazione');

    fixture.componentRef.setInput('navigationLabel', 'Primary navigation');
    fixture.detectChanges();

    expect(nav.getAttribute('aria-label')).toBe('Primary navigation');
  });

  it('should collapse by default only when there is more than one navigation item', () => {
    createComponent();
    fixture.componentRef.setInput('navigation', [{ routerLink: '/page-1', text: 'Page 1' }]);
    fixture.detectChanges();

    expect(toggleButton()).toBeNull();

    fixture.componentRef.setInput('navigation', [
      { routerLink: '/page-1', text: 'Page 1' },
      { routerLink: '/page-2', text: 'Page 2' },
    ]);
    fixture.detectChanges();

    expect(toggleButton()).toBeTruthy();
  });

  it('should render the menu button for a lone link when collapseOnMobile is true', () => {
    isDesktopViewport = false;
    createComponent();
    fixture.componentRef.setInput('navigation', [{ routerLink: '/page-1', text: 'Page 1' }]);
    fixture.componentRef.setInput('collapseOnMobile', true);
    fixture.detectChanges();

    expect(toggleButton()).toBeTruthy();
    expect(toggleButton().textContent).toContain('Menu');
  });

  it('should not render the menu button and keep the list visible when collapseOnMobile is false', () => {
    isDesktopViewport = false;
    createComponent();
    fixture.componentRef.setInput('navigation', [
      { routerLink: '/page-1', text: 'Page 1' },
      { routerLink: '/page-2', text: 'Page 2' },
    ]);
    fixture.componentRef.setInput('collapseOnMobile', false);
    fixture.detectChanges();

    expect(toggleButton()).toBeNull();
    expect(navigationList().hidden).toBe(false);
  });

  it('should hide the menu button from assistive tech on desktop and keep the list visible', () => {
    createComponent();
    fixture.componentRef.setInput('navigation', [
      { routerLink: '/page-1', text: 'Page 1' },
      { routerLink: '/page-2', text: 'Page 2' },
    ]);
    fixture.detectChanges();

    expect(toggleButton().hidden).toBe(true);
    expect(toggleButton().getAttribute('aria-hidden')).toBe('true');
    expect(toggleButton().getAttribute('aria-expanded')).toBeNull();
    expect(navigationList().hidden).toBe(false);
  });

  it('should toggle the list and aria-expanded when the menu button is clicked on mobile', () => {
    isDesktopViewport = false;
    createComponent();
    fixture.componentRef.setInput('navigation', [
      { routerLink: '/page-1', text: 'Page 1' },
      { routerLink: '/page-2', text: 'Page 2' },
    ]);
    fixture.detectChanges();

    expect(toggleButton().hidden).toBe(false);
    expect(toggleButton().getAttribute('aria-expanded')).toBe('false');
    expect(navigationList().hidden).toBe(true);

    toggleButton().click();
    fixture.detectChanges();

    expect(toggleButton().getAttribute('aria-expanded')).toBe('true');
    expect(navigationList().hidden).toBe(false);

    toggleButton().click();
    fixture.detectChanges();

    expect(toggleButton().getAttribute('aria-expanded')).toBe('false');
    expect(navigationList().hidden).toBe(true);
  });

  it('should only set an aria-label on the menu button when it differs from the button text', () => {
    createComponent();
    fixture.componentRef.setInput('navigation', [
      { routerLink: '/page-1', text: 'Page 1' },
      { routerLink: '/page-2', text: 'Page 2' },
    ]);
    fixture.componentRef.setInput('menuButtonLabel', 'Menu');
    fixture.detectChanges();

    expect(toggleButton().getAttribute('aria-label')).toBeNull();

    fixture.componentRef.setInput('menuButtonLabel', 'Show or hide menu');
    fixture.detectChanges();

    expect(toggleButton().getAttribute('aria-label')).toBe('Show or hide menu');
  });
});
