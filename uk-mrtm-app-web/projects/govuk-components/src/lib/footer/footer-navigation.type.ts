import type { GovukLinkItem } from '../types/link-item.type';

/** A column of links in the footer. */
export interface GovukFooterNavigation {
  readonly title: string;
  readonly items: readonly GovukLinkItem[];
  /** Grid width, e.g. `two-thirds`. Defaults to `full`. */
  readonly width?: string;
  /** Splits the list over this many columns. */
  readonly columns?: 1 | 2 | 3;
}
