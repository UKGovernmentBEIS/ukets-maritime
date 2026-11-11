import type { Params, QueryParamsHandling } from '@angular/router';

/**
 * Describes where a GOV.UK link should navigate to.
 *
 * Use `routerLink` for navigation inside the Angular application and `href`
 * for anything that leaves it. When both are supplied `routerLink` wins.
 */
export interface GovukLinkTarget {
  /** External URL. Rendered as a plain `href`. */
  readonly href?: string;
  /** Internal route. Rendered with `RouterLink`, so no full page reload. */
  readonly routerLink?: string | readonly unknown[];
  readonly queryParams?: Params | null;
  readonly queryParamsHandling?: QueryParamsHandling | null;
  readonly fragment?: string;
  readonly preserveFragment?: boolean;
  readonly skipLocationChange?: boolean;
  readonly replaceUrl?: boolean;
  readonly state?: Record<string, unknown>;
  /** `target` attribute, e.g. `_blank`. */
  readonly target?: string;
  /** `rel` attribute. Set automatically to `noreferrer noopener` for `_blank`. */
  readonly rel?: string;
}
