import { Directive, DOCUMENT, inject } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: 'router-outlet[mrtmSkipLinkFocus]',
  host: { '(activate)': 'onRouteActivation()' },
})
export class SkipLinkFocusDirective {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  // Mirrors a full page load: the next Tab lands on the skip link, without showing it.
  onRouteActivation(): void {
    if (this.router.currentNavigation()?.trigger === 'popstate') {
      return;
    }

    const target = this.document.querySelector<HTMLElement>('govuk-skip-link');
    if (!target) {
      return;
    }

    target.tabIndex = 0;
    target.focus({ preventScroll: true });
    target.removeAttribute('tabindex');
  }
}
