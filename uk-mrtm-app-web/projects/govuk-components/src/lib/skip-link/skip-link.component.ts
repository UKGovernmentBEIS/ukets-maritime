import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

/**
 * GOV.UK skip link.
 *
 * Implements the GOV.UK Design System
 * [Skip link](https://design-system.service.gov.uk/components/skip-link/) component.
 *
 * Reproduces the behaviour of the GOV.UK Frontend skip link script: following
 * the link moves focus to the target so keyboard and screen reader users
 * continue from the main content rather than the top of the page.
 *
 * ```html
 * <govuk-skip-link />
 * <govuk-skip-link targetId="search-results" text="Skip to results" />
 * ```
 */
@Component({
  selector: 'govuk-skip-link',
  template: `
    <a class="govuk-skip-link" [href]="'#' + targetId()" (click)="focusTarget($event)">{{ text() }}</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSkipLinkComponent {
  private readonly document = inject(DOCUMENT);

  /** Id of the element to skip to. Defaults to the GOV.UK page template's `main`. */
  readonly targetId = input('main-content');

  /** Link text. Defaults to `Skip to main content`. */
  readonly text = input('Skip to main content');

  protected focusTarget(event: MouseEvent): void {
    const target = this.document.getElementById(this.targetId());
    if (!target) {
      return;
    }

    event.preventDefault();

    // The target is usually a `<main>`, which is not focusable by default.
    // `tabindex="-1"` makes it programmatically focusable without adding it to
    // the tab order, and is removed again on blur so the outline is not shown
    // on a later mouse click.
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.classList.add('govuk-skip-link-focused-element');
      target.addEventListener(
        'blur',
        () => {
          target.removeAttribute('tabindex');
          target.classList.remove('govuk-skip-link-focused-element');
        },
        { once: true },
      );
    }

    target.focus();
    // Guarded because `scrollIntoView` is missing in non-visual environments
    // such as jsdom and server-side rendering.
    target.scrollIntoView?.();
  }
}
