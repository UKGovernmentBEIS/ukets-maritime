import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { isRouterLink } from '../core/link';
import { type GovukLinkTarget } from '../types/link-target.type';

/**
 * GOV.UK header.
 *
 * The blue brand-coloured bar carrying the GOV.UK logo. Service names and
 * navigation belong in the service navigation component below it, not here.
 * Projected content is rendered in the actions area on the right-hand side of
 * the bar.
 *
 * ```html
 * <govuk-header [homepage]="{ href: 'https://www.gov.uk' }" productName="Veterans UK" />
 * ```
 */
@Component({
  selector: 'govuk-header',
  imports: [RouterLink, NgTemplateOutlet],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'govuk-header' },
})
export class GovukHeaderComponent {
  /** Where the GOV.UK logo links to. Defaults to `//gov.uk`. */
  readonly homepage = input<GovukLinkTarget>();

  /** Name of the product, shown next to the logo. */
  readonly productName = input<string>();

  /** Classes for the inner container, e.g. `govuk-width-container--wide`. */
  readonly containerClasses = input('govuk-width-container');

  protected readonly containerClass = computed(() => `govuk-header__container ${this.containerClasses()}`.trim());

  protected readonly isRouterLink = isRouterLink;
}
