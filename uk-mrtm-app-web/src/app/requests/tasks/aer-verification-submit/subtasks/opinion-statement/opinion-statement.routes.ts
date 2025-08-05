import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { opinionStatementMap, OpinionStatementStep } from '@requests/common/aer';
import {
  canActivateOpinionStatementStep,
  canActivateOpinionStatementSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/opinion-statement/opinion-statement.guard';

export const OPINION_STATEMENT_ROUTES: Routes = [
  {
    path: '',
    title: opinionStatementMap.title,
    canActivate: [canActivateOpinionStatementSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/opinion-statement/opinion-statement-summary').then(
        (c) => c.OpinionStatementSummaryComponent,
      ),
  },
  {
    path: OpinionStatementStep.EMISSIONS_FORM,
    title: opinionStatementMap.emissionsCorrect.title,
    canActivate: [canActivateOpinionStatementStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OpinionStatementStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/opinion-statement/opinion-statement-emissions-form'
      ).then((c) => c.OpinionStatementEmissionsFormComponent),
  },
  {
    path: OpinionStatementStep.ADDITIONAL_CHANGES,
    title: opinionStatementMap.additionalChangesNotCovered.title,
    canActivate: [canActivateOpinionStatementStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OpinionStatementStep.SUMMARY, OpinionStatementStep.EMISSIONS_FORM),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/opinion-statement/opinion-statement-additional-changes'
      ).then((c) => c.OpinionStatementAdditionalChangesComponent),
  },
  {
    path: OpinionStatementStep.SITE_VISIT_TYPE,
    title: opinionStatementMap.siteVisitType.title,
    canActivate: [canActivateOpinionStatementStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OpinionStatementStep.SUMMARY, OpinionStatementStep.ADDITIONAL_CHANGES),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/opinion-statement/opinion-statement-site-visit-type'
      ).then((c) => c.OpinionStatementSiteVisitTypeComponent),
  },
  {
    path: OpinionStatementStep.SITE_VISIT_IN_PERSON,
    title: opinionStatementMap.siteVisitDetailsInPerson.title,
    canActivate: [canActivateOpinionStatementStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OpinionStatementStep.SUMMARY, OpinionStatementStep.SITE_VISIT_TYPE),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/opinion-statement/opinion-statement-site-visit-in-person'
      ).then((c) => c.OpinionStatementSiteVisitInPersonComponent),
  },
  {
    path: OpinionStatementStep.SITE_VISIT_VIRTUAL,
    title: opinionStatementMap.siteVisitDetailsVirtual.title,
    canActivate: [canActivateOpinionStatementStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OpinionStatementStep.SUMMARY, OpinionStatementStep.SITE_VISIT_TYPE),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/opinion-statement/opinion-statement-site-visit-virtual'
      ).then((c) => c.OpinionStatementSiteVisitVirtualComponent),
  },
];
