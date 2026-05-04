import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterOutlet } from '@angular/router';

import { SkipLinkComponent } from '@netz/govuk-components';

import { SkipLinkFocusDirective } from '@shared/directives';

describe('SkipLinkFocusDirective', () => {
  @Component({
    imports: [SkipLinkComponent, RouterOutlet, SkipLinkFocusDirective],
    standalone: true,
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
});
