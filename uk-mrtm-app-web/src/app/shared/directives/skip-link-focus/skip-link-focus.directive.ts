import { DOCUMENT } from '@angular/common';
import { Directive, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: 'router-outlet[mrtmSkipLinkFocus]',
  standalone: true,
})
export class SkipLinkFocusDirective {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  @HostListener('activate')
  onRouteActivation(): void {
    if (this.router.getCurrentNavigation()?.trigger !== 'popstate') {
      const target = this.document.querySelector('govuk-skip-link') as HTMLElement;
      target.tabIndex = 0;
      target.focus({ preventScroll: true });
      target.removeAttribute('tabIndex');
    }
  }
}
