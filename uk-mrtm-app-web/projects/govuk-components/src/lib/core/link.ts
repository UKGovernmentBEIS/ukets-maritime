import type { GovukLinkTarget } from '../types/link-target.type';

/** True when the target should be rendered with `RouterLink`. */
export const isRouterLink = (target: GovukLinkTarget | undefined): boolean => target?.routerLink !== undefined;

/** Resolves the `rel` attribute, defaulting `target="_blank"` links to a safe value. */
export const resolveRel = (target: GovukLinkTarget | undefined): string | null => {
  if (target?.rel) {
    return target.rel;
  }
  return target?.target === '_blank' ? 'noreferrer noopener' : null;
};
