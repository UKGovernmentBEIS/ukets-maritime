import { type GovukLinkTarget } from '../types/link-target.type';

/**
 * A single navigation link.
 *
 * Service navigation moves between pages of the same Angular application, so
 * every item routes: `routerLink` is required, and `href`, `target` and `rel`
 * are deliberately not part of this shape.
 */
export interface GovukServiceNavigationItem extends Omit<GovukLinkTarget, 'href' | 'routerLink' | 'target' | 'rel'> {
  text: string;
  /** Route this item navigates to. */
  routerLink: string | unknown[];
}
