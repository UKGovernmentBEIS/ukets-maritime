import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { virSubtaskList } from '@requests/common/vir';
import {
  canActivateUploadEvidenceForm,
  canActivateUploadEvidenceQuestionForm,
  canActivateVirRespondToRecommendationSummary,
} from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation/respond-to-recommendation.guard';
import { VirRespondToRecommendationWizardStep } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation/respond-to-recommendation.helpers';

export const RESPOND_TO_RECOMMENDATION_ROUTES: Routes = [
  {
    path: ':key',
    children: [
      {
        path: '',
        title: 'Check your answers',
        data: { breadcrumb: false, backlink: '../../../' },
        canActivate: [canActivateVirRespondToRecommendationSummary],
        loadComponent: () =>
          import('@requests/tasks/vir-submit/subtasks/respond-to-recommendation/respond-to-recommendation-summary').then(
            (c) => c.RespondToRecommendationSummaryComponent,
          ),
      },
      {
        path: VirRespondToRecommendationWizardStep.RESPOND_TO,
        title: virSubtaskList.title,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(VirRespondToRecommendationWizardStep.SUMMARY, '../../../'),
        },
        loadComponent: () =>
          import('@requests/tasks/vir-submit/subtasks/respond-to-recommendation/respond-to-recommendation-form').then(
            (c) => c.RespondToRecommendationFormComponent,
          ),
      },
      {
        path: VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_QUESTION,
        title: virSubtaskList.title,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(
            VirRespondToRecommendationWizardStep.SUMMARY,
            VirRespondToRecommendationWizardStep.RESPOND_TO,
          ),
        },
        canActivate: [canActivateUploadEvidenceQuestionForm],
        loadComponent: () =>
          import('@requests/tasks/vir-submit/subtasks/respond-to-recommendation/upload-evidence-question-form').then(
            (c) => c.UploadEvidenceQuestionFormComponent,
          ),
      },
      {
        path: VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_FORM,
        title: virSubtaskList.title,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(
            VirRespondToRecommendationWizardStep.SUMMARY,
            VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_QUESTION,
          ),
        },
        canActivate: [canActivateUploadEvidenceForm],
        loadComponent: () =>
          import('@requests/tasks/vir-submit/subtasks/respond-to-recommendation/upload-evidence-form').then(
            (c) => c.UploadEvidenceFormComponent,
          ),
      },
    ],
  },
];
