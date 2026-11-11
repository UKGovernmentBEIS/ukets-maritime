import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Navigation, provideRouter, Router, RouterOutlet } from '@angular/router';

import { GovukSkipLinkComponent } from '@netz/govuk-components';

import { SkipLinkFocusDirective } from '@shared/directives';

describe('SkipLinkFocusDirective', () => {
  @Component({
    imports: [GovukSkipLinkComponent, RouterOutlet, SkipLinkFocusDirective],
    template: '<govuk-skip-link /><router-outlet mrtmSkipLinkFocus />',
  })
  class TestComponent {}

  let directive: SkipLinkFocusDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'test', component: TestComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(SkipLinkFocusDirective)).injector.get(SkipLinkFocusDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should focus to skip link after navigation', async () => {
    expect(document.activeElement).toEqual(document.body);

    await TestBed.inject(Router).navigate(['test']);
    expect(fixture.nativeElement.querySelector('govuk-skip-link')).toEqual(document.activeElement);
  });

  it('should leave the skip link out of the tab order after focusing it', async () => {
    await TestBed.inject(Router).navigate(['test']);

    expect(fixture.nativeElement.querySelector('govuk-skip-link').hasAttribute('tabindex')).toBe(false);
  });

  it('should not move focus on back or forward navigation', () => {
    vi.spyOn(TestBed.inject(Router), 'currentNavigation').mockReturnValue({ trigger: 'popstate' } as Navigation);

    directive.onRouteActivation();

    expect(document.activeElement).toEqual(document.body);
  });

  it('should not throw when there is no skip link on the page', () => {
    fixture.nativeElement.querySelector('govuk-skip-link').remove();

    expect(() => directive.onRouteActivation()).not.toThrow();
    expect(document.activeElement).toEqual(document.body);
  });
});
