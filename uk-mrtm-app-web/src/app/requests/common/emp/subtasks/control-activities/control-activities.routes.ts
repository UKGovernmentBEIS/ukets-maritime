import { Routes } from '@angular/router';

import {
  canActivateControlActivitiesStep,
  canActivateControlActivitiesSummary,
} from '@requests/common/emp/subtasks/control-activities/control-activities.guard';
import { ControlActivitiesWizardStep } from '@requests/common/emp/subtasks/control-activities/control-activities.helpers';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';

export const CONTROL_ACTIVITY_ROUTES: Routes = [
  {
    path: '',
    title: controlActivitiesMap.title,
    canActivate: [canActivateControlActivitiesSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/control-activities').then((c) => c.ControlActivitiesSummaryComponent),
  },
  {
    path: ControlActivitiesWizardStep.QUALITY_ASSURANCE,
    title: controlActivitiesMap.qualityAssurance.title,
    canActivate: [canActivateControlActivitiesStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(ControlActivitiesWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/control-activities/control-activities-quality-assurance').then(
        (c) => c.ControlActivitiesQualityAssuranceComponent,
      ),
  },
  {
    path: ControlActivitiesWizardStep.INTERNAL_REVIEWS,
    title: controlActivitiesMap.internalReviews.title,
    canActivate: [canActivateControlActivitiesStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(ControlActivitiesWizardStep.SUMMARY, ControlActivitiesWizardStep.QUALITY_ASSURANCE),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/control-activities/control-activities-internal-reviews').then(
        (c) => c.ControlActivitiesInternalReviewsComponent,
      ),
  },
  {
    path: ControlActivitiesWizardStep.CORRECTIONS,
    title: controlActivitiesMap.corrections.title,
    canActivate: [canActivateControlActivitiesStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(ControlActivitiesWizardStep.SUMMARY, ControlActivitiesWizardStep.INTERNAL_REVIEWS),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/control-activities/control-activities-corrections-and-correctives').then(
        (c) => c.ControlActivitiesCorrectionsAndCorrectivesComponent,
      ),
  },
  {
    path: ControlActivitiesWizardStep.OUTSOURCED_ACTIVITIES,
    title: controlActivitiesMap.outsourcedActivities.title,
    canActivate: [canActivateControlActivitiesStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(ControlActivitiesWizardStep.SUMMARY, ControlActivitiesWizardStep.CORRECTIONS),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/control-activities/control-activities-outsourced-activities').then(
        (c) => c.ControlActivitiesOutsourcedActivitiesComponent,
      ),
  },
  {
    path: ControlActivitiesWizardStep.DOCUMENTATION,
    title: controlActivitiesMap.documentation.title,
    canActivate: [canActivateControlActivitiesStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        ControlActivitiesWizardStep.SUMMARY,
        ControlActivitiesWizardStep.OUTSOURCED_ACTIVITIES,
      ),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/control-activities/control-activities-documentation').then(
        (c) => c.ControlActivitiesDocumentationComponent,
      ),
  },
];
