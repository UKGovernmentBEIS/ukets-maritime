import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NotificationBannerComponent } from '../../notification-banner';
import { LinkDirective } from './link.directive';

describe('LinkDirective', () => {
  @Component({
    imports: [LinkDirective, NotificationBannerComponent],
    standalone: true,
    template: `
      <a #breadcrumb govukLink="breadcrumb" href="#">Test Breadcrumb Link</a>
      <h1>Some middle text</h1>
      <a #summaryAction govukLink="summaryAction" href="#">Test Summary Action Link</a>
      <a #simple govukLink href="#">Simple link</a>
      <govuk-notification-banner>
        <p class="govuk-body">
          There is a request waiting!
          <a #notification govukLink="notification" href="#">Click here</a>
        </p>
      </govuk-notification-banner>
    `,
  })
  class TestComponent {
    readonly breadcrumbLink = viewChild<ElementRef<HTMLAnchorElement>>('breadcrumb');
    readonly summaryActionLink = viewChild<ElementRef<HTMLAnchorElement>>('summaryAction');
    readonly simpleLink = viewChild<ElementRef<HTMLAnchorElement>>('simple');
    readonly notificationLink = viewChild<ElementRef<HTMLAnchorElement>>('notification');
  }

  let directive: LinkDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(LinkDirective)).injector.get(LinkDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should add navigation li element and link class (breadcrumb link)', () => {
    const breadcrumbLinkElement: HTMLElement = fixture.componentInstance.breadcrumbLink().nativeElement;
    const parentElement: HTMLElement = breadcrumbLinkElement.parentElement;

    expect(breadcrumbLinkElement.classList).toContain('govuk-breadcrumbs__link');
    expect(parentElement.tagName).toEqual('LI');
    expect(parentElement.classList).toContain('govuk-breadcrumbs__list-item');
  });

  it('should add navigation li element and link class (summary action link)', () => {
    const summaryActionLinkElement: HTMLElement = fixture.componentInstance.summaryActionLink().nativeElement;
    const parentElement: HTMLElement = summaryActionLinkElement.parentElement;

    expect(summaryActionLinkElement.classList).toContain('govuk-link');
    expect(parentElement.tagName).toEqual('LI');
    expect(parentElement.classList).toContain('govuk-summary-card__action');
  });

  it('should apply the link class to simple links', () => {
    expect(fixture.componentInstance.simpleLink().nativeElement.classList).toContain('govuk-link');
  });

  it('should not wrap simple links with list elements', () => {
    expect(fixture.componentInstance.simpleLink().nativeElement.parentElement.tagName).not.toEqual('LI');
  });

  it('should apply the notification link class in links inside the notification banner', () => {
    expect(fixture.componentInstance.notificationLink().nativeElement.className).toEqual(
      'govuk-notification-banner__link',
    );
  });

  it('should keep the order of sibling elements', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('h1').nextElementSibling.textContent).toEqual('Test Summary Action Link');
  });

  it('should clean up the li element on destroy', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.destroy();
    expect(element.querySelectorAll('li')).toHaveLength(0);
  });
});
