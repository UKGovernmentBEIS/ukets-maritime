import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { filter, Subscription } from 'rxjs';

@Directive({
  selector: 'a[govukLink]',
  standalone: true,
})
export class LinkDirective implements OnDestroy, OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly link = inject(RouterLink, { optional: true });
  private readonly linkWithHref = inject(RouterLink, { optional: true });

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('govukLink')
  navLinkType: 'header' | 'footer' | 'meta' | 'breadcrumb' | 'notification' | 'summaryAction' | '' = '';

  private isActive = false;
  private subscription: Subscription;
  private liElement: HTMLLIElement;

  @HostBinding('class.govuk-link') get hasSimpleLink() {
    return !this.navLinkType || this.navLinkType === 'summaryAction';
  }

  @HostBinding('class.govuk-breadcrumbs__link') get hasBreadcrumbsLink() {
    return this.navLinkType === 'breadcrumb';
  }

  @HostBinding('class.govuk-footer__link') get hasFooterLink() {
    return this.navLinkType === 'meta' || this.navLinkType === 'footer';
  }

  @HostBinding('class.govuk-header__link') get hasHeaderLink() {
    return this.navLinkType === 'header';
  }

  @HostBinding('class.govuk-notification-banner__link') get hasNotificationLink() {
    return this.navLinkType === 'notification';
  }

  ngOnInit(): void {
    if (this.navLinkType) {
      this.subscription = this.router.events
        .pipe(filter((s) => s instanceof NavigationEnd))
        .subscribe(() => this.update());

      const element: HTMLElement = this.elementRef.nativeElement;
      const parentNode = element.parentNode;
      this.liElement = this.renderer.createElement('li');
      this.renderer.addClass(this.liElement, this.getLiClassName());
      this.renderer.insertBefore(parentNode, this.liElement, element);
      this.renderer.appendChild(this.liElement, element);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.liElement) {
      this.renderer.removeChild(this.liElement.parentElement, this.liElement);
    }
  }

  private getLiClassName(): string {
    switch (this.navLinkType) {
      case 'meta':
        return 'govuk-footer__inline-list-item';
      case 'footer':
        return 'govuk-footer__list-item';
      case 'header':
        return 'govuk-header__navigation-item';
      case 'breadcrumb':
        return 'govuk-breadcrumbs__list-item';
      case 'summaryAction':
        return 'govuk-summary-card__action';
      default:
        return null;
    }
  }

  private getActiveLiClassName(): string {
    switch (this.navLinkType) {
      case 'header':
        return 'govuk-header__navigation-item--active';
      default:
        return null;
    }
  }

  private isLinkActive(link: RouterLink): boolean {
    return this.router.isActive(link.urlTree, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  private hasActiveLinks(): boolean {
    return (this.link && this.isLinkActive(this.link)) || (this.linkWithHref && this.isLinkActive(this.linkWithHref));
  }

  private update(): void {
    const activeClass = this.getActiveLiClassName();
    const hasActiveLinks = this.hasActiveLinks();
    if (this.isActive !== hasActiveLinks) {
      this.isActive = hasActiveLinks;

      if (hasActiveLinks) {
        this.renderer.addClass(this.liElement, activeClass);
      } else {
        this.renderer.removeClass(this.liElement, activeClass);
      }

      this.changeDetectorRef.markForCheck();
    }
  }
}
