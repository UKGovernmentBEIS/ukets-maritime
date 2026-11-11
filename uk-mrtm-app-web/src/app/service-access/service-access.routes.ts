import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { RegulatorsGuard } from '@service-access/regulators/regulators.guard';
import { roleCanMatch } from '@service-access/service-access.guards';
import {
  RegulatorSiteContactsAdapter,
  SITE_CONTACTS_ADAPTER,
  VerifierSiteContactsAdapter,
} from '@service-access/site-contacts/site-contacts.adapter';
import { verifiersGuard } from '@service-access/verifiers/verifiers.guard';

// The tabs are fragments of the service access page (e.g. /service-access#regulator-users) and the
// flows keep the tab path as their prefix (e.g. /service-access/regulator-users/add). The tab path
// itself has no page, so the breadcrumb of a flow links to the tab fragment instead.
const tabBreadcrumb = (text: string, tab: string) => ({
  resolveText: () => text,
  link: ['/service-access'],
  fragment: tab,
});

export const SERVICE_ACCESS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canMatch: [roleCanMatch('REGULATOR')],
    title: 'Service access',
    data: { breadcrumb: false },
    resolve: { regulators: RegulatorsGuard },
    canDeactivate: [PendingRequestGuard],
    providers: [{ provide: SITE_CONTACTS_ADAPTER, useClass: RegulatorSiteContactsAdapter }],
    loadComponent: () => import('@service-access/service-access.component').then((c) => c.ServiceAccessComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    canMatch: [roleCanMatch('VERIFIER')],
    title: 'Service access',
    data: { breadcrumb: false },
    canActivate: [verifiersGuard],
    canDeactivate: [PendingRequestGuard],
    providers: [{ provide: SITE_CONTACTS_ADAPTER, useClass: VerifierSiteContactsAdapter }],
    loadComponent: () => import('@service-access/service-access.component').then((c) => c.ServiceAccessComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {
    path: 'regulator-users',
    canMatch: [roleCanMatch('REGULATOR')],
    data: { breadcrumb: tabBreadcrumb('Regulator users', 'regulator-users') },
    loadChildren: () => import('@service-access/regulators/regulators.routes').then((m) => m.REGULATORS_ROUTES),
  },
  {
    path: 'external-contacts',
    canMatch: [roleCanMatch('REGULATOR')],
    data: { breadcrumb: tabBreadcrumb('External contacts', 'external-contacts') },
    loadChildren: () =>
      import('@service-access/external-contacts/external-contacts.routes').then((m) => m.EXTERNAL_CONTACTS_ROUTES),
  },
  {
    path: 'verification-bodies',
    canMatch: [roleCanMatch('REGULATOR')],
    data: { breadcrumb: tabBreadcrumb('Verification bodies', 'verification-bodies') },
    loadChildren: () =>
      import('@service-access/verification-bodies/verification-bodies.routes').then(
        (m) => m.VERIFICATION_BODIES_ROUTES,
      ),
  },
  {
    // Both roles' data supplier flows; each flow route carries its own role check
    path: 'data-suppliers',
    data: { breadcrumb: tabBreadcrumb('Data suppliers', 'data-suppliers') },
    loadChildren: () =>
      import('@service-access/data-suppliers/data-suppliers.routes').then((m) => m.DATA_SUPPLIERS_ROUTES),
  },
  {
    // Regulators also delete verifier users from a verification body's contacts tab
    path: 'verifier-users',
    canMatch: [roleCanMatch('VERIFIER', 'REGULATOR')],
    data: { breadcrumb: tabBreadcrumb('Verifier users', 'verifier-users') },
    loadChildren: () => import('@service-access/verifiers/verifiers.routes').then((m) => m.VERIFIERS_ROUTES),
  },
];
