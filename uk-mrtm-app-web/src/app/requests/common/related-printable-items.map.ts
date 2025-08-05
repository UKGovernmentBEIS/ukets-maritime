import { RelatedPrintableItemsMap } from '@netz/common/components';

import {
  AerSubmittedReportComponent,
  AerVerificationSubmittedReportComponent,
} from '@requests/common/timeline/components';

export const relatedPrintableItemsMap: RelatedPrintableItemsMap = {
  AER_APPLICATION_SENT_TO_VERIFIER: AerSubmittedReportComponent,
  AER_APPLICATION_SUBMITTED: AerSubmittedReportComponent,
  AER_APPLICATION_VERIFICATION_SUBMITTED: AerVerificationSubmittedReportComponent,
};
