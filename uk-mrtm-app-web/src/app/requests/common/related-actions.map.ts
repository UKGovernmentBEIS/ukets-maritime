import { RelatedActionsMap } from '@netz/common/components';

import {
  AER_VERIFICATION_RETURN_TO_OPERATOR_ROUTE,
  AER_VERIFICATION_SUBMIT_ROUTE_PREFIX,
} from '@requests/common/aer/aer.consts';

export const relatedActionsMap: RelatedActionsMap = {
  ACCOUNT_CLOSURE_CANCEL_APPLICATION: { text: 'Cancel application', path: ['cancel'] },
  EMP_NOTIFICATION_CANCEL_APPLICATION: { text: 'Cancel this task', path: ['cancel'] },
  EMP_ISSUANCE_RECALL_FROM_AMENDS: { text: 'Recall the application', path: ['recall'] },
  EMP_VARIATION_RECALL_FROM_AMENDS: { text: 'Recall the variation', path: ['recall'] },
  EMP_NOTIFICATION_FOLLOW_UP_RECALL_FROM_AMENDS: { text: 'Recall your response', path: ['recall'] },
  EMP_VARIATION_CANCEL_APPLICATION: { text: 'Cancel task', path: ['cancel'] },
  RFI_SUBMIT: { text: 'Request for information', path: ['rfi', 'submit'] },
  RDE_SUBMIT: { text: 'Request deadline extension', path: ['rde', 'submit'] },
  CANCEL_APPLICATION: { text: 'Cancel request', path: ['cancel'] },
  DOE: { text: 'Determine maritime emissions', path: ['create-action', 'DOE'] },
  DOE_CANCEL_APPLICATION: { text: 'Cancel task', path: ['cancel'] },
  EMP_ISSUANCE_SEND_REGISTRY_ACCOUNT_OPENING_EVENT: { text: 'Integration with Registry', path: ['registry', 'submit'] },
  AER_RECALL_FROM_VERIFICATION: { text: 'Recall report from verifier', path: ['recall'] },
  AER_VERIFICATION_RETURN_TO_OPERATOR: {
    text: 'Return to operator for changes',
    path: [AER_VERIFICATION_SUBMIT_ROUTE_PREFIX, AER_VERIFICATION_RETURN_TO_OPERATOR_ROUTE],
  },
  AER_SKIP_REVIEW: { text: 'Skip review and complete report', path: ['aer-review', 'skip-review'] },
  // NON_COMPLIANCE_CLOSE_APPLICATION: { text: 'Close task', path: ['.'] }, // TODO MRTM-2443
};
