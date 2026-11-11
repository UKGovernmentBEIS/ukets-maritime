import { Data } from '@angular/router';

export interface BreadcrumbItem {
  text: string;
  link?: any[];
  queryParams?: any;
  fragment?: string;
}

export type RouteBreadcrumb =
  | string
  | boolean
  | ((data: Data) => string)
  | {
      resolveText: (data: Data) => string;
      skipLink?: boolean | ((data: Data) => boolean);
      /**
       * An explicit target for the breadcrumb, used instead of the route's own URL.
       * Suits routes without a page of their own, e.g. a tab addressed by a fragment of the parent page.
       */
      link?: any[];
      fragment?: string;
    };
