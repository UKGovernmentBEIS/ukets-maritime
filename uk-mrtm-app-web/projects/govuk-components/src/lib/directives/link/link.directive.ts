import { Directive, ElementRef, inject, input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'a[govukLink]',
  standalone: true,
  host: {
    '[class.govuk-link]': 'hasSimpleLink',
    '[class.govuk-breadcrumbs__link]': 'hasBreadcrumbsLink',
    '[class.govuk-notification-banner__link]': 'hasNotificationLink',
  },
})
export class LinkDirective implements OnDestroy, OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  readonly navLinkType = input<'breadcrumb' | 'notification' | 'summaryAction' | ''>('', {
    alias: 'govukLink',
  });

  private liElement: HTMLLIElement;

  get hasSimpleLink() {
    const navLinkType = this.navLinkType();
    return !navLinkType || navLinkType === 'summaryAction';
  }

  get hasBreadcrumbsLink() {
    return this.navLinkType() === 'breadcrumb';
  }

  get hasNotificationLink() {
    return this.navLinkType() === 'notification';
  }

  ngOnInit(): void {
    if (this.navLinkType()) {
      const element: HTMLElement = this.elementRef.nativeElement;
      const parentNode = element.parentNode;
      this.liElement = this.renderer.createElement('li');
      this.renderer.addClass(this.liElement, this.getLiClassName());
      this.renderer.insertBefore(parentNode, this.liElement, element);
      this.renderer.appendChild(this.liElement, element);
    }
  }

  ngOnDestroy(): void {
    if (this.liElement) {
      this.renderer.removeChild(this.liElement.parentElement, this.liElement);
    }
  }

  private getLiClassName(): string {
    switch (this.navLinkType()) {
      case 'breadcrumb':
        return 'govuk-breadcrumbs__list-item';
      case 'summaryAction':
        return 'govuk-summary-card__action';
      default:
        return null;
    }
  }
}
