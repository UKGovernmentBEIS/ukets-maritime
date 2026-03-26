import { Directive, DOCUMENT, inject } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: 'router-outlet[mrtmSkipLinkFocus]',
  standalone: true,
  host: { '(activate)': 'onRouteActivation()' },
})
export class SkipLinkFocusDirective {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  onRouteActivation(): void {
    if (this.router.currentNavigation()?.trigger !== 'popstate') {
      const target = this.document.querySelector('govuk-skip-link') as HTMLElement;
      target.tabIndex = 0;
      target.focus({ preventScroll: true });
      target.removeAttribute('tabIndex');
    }
  }
}
