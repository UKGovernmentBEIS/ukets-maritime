import { Routes } from '@angular/router';

import { BusinessErrorComponent } from './business-error';
import { InternalServerErrorComponent } from './internal-server-error';
import { PageNotFoundComponent } from './page-not-found';

export const ERROR_ROUTES: Routes = [
  {
    path: '500',
    title: 'Sorry, there is a problem with the service',
    component: InternalServerErrorComponent,
  },
  {
    path: 'business',
    component: BusinessErrorComponent,
  },
  {
    path: '404',
    title: 'Page not found',
    component: PageNotFoundComponent,
  },
];
