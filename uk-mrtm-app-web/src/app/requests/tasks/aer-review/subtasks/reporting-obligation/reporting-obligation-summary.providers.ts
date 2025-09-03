import { computed, Provider } from '@angular/core';

import { RequestTaskStore } from '@netz/common/store';

import { reportingObligationMap } from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AER_REVIEW_SUBTASK_DETAILS } from '@requests/tasks/aer-review/aer-review.constants';
import { AerReviewSummaryDetailsSection } from '@requests/tasks/aer-review/aer-review.types';
import { ReportingObligationSummaryTemplateComponent } from '@shared/components';

export const provideReportingObligationDetailsSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: ReportingObligationSummaryTemplateComponent,
      inputs: computed(() => {
        const reportingObligationDetails = store.select(aerCommonQuery.selectReportingObligationDetails)();

        return {
          reportingYear: store.select(aerCommonQuery.selectReportingYear)(),
          reportingRequired: store.select(aerCommonQuery.selectReportingRequired)(),
          reportingObligationDetails,
          files: store.select(aerCommonQuery.selectAttachedFiles(reportingObligationDetails?.supportingDocuments))(),
          map: reportingObligationMap,
        };
      }),
    };
  },
};
