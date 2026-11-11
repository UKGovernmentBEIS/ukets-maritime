import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { isRouterLink, resolveRel } from '../core/link';
import type { GovukLinkItem } from '../types/link-item.type';
import type { GovukFooterNavigation } from './footer-navigation.type';

/**
 * GOV.UK footer.
 *
 * ```html
 * <govuk-footer
 *   [meta]="[
 *     { text: 'Cookies', routerLink: '/cookies' },
 *     { text: 'Accessibility statement', routerLink: '/accessibility' },
 *   ]" />
 * ```
 */
@Component({
  selector: 'govuk-footer',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './footer.component.html',
  styles: ':host { display: block; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'govuk-footer' },
})
export class GovukFooterComponent {
  /** Columns of links shown above the meta row. */
  readonly navigation = input<readonly GovukFooterNavigation[]>([]);

  /** Support links shown in the meta row. */
  readonly meta = input<readonly GovukLinkItem[]>([]);

  readonly metaVisuallyHiddenTitle = input('Support links');

  /** Set to false for content not covered by the Open Government Licence. */
  readonly showContentLicence = input(true, { transform: booleanAttribute });

  readonly copyright = input('© Crown copyright');

  readonly containerClasses = input('');

  protected readonly containerClass = computed(() => `govuk-width-container ${this.containerClasses()}`.trim());

  protected readonly isRouterLink = isRouterLink;
  protected readonly rel = resolveRel;

  protected listClasses(section: GovukFooterNavigation): string {
    return section.columns ? `govuk-footer__list govuk-footer__list--columns-${section.columns}` : 'govuk-footer__list';
  }
}
