import type { GovukLinkTarget } from './link-target.type';

/** A link rendered as list item text. */
export interface GovukLinkItem extends GovukLinkTarget {
  readonly text: string;
  readonly classes?: string;
  /** Extra context announced to assistive technology only. */
  readonly visuallyHiddenText?: string;
}
