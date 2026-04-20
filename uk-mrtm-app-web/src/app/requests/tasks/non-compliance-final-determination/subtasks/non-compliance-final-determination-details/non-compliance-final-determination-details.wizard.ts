import { isNil } from 'lodash-es';

import { NonComplianceFinalDetermination } from '@mrtm/api';

export const isWizardCompleted = (nonComplianceFinalDetermination: NonComplianceFinalDetermination): boolean => {
  return (
    !isNil(nonComplianceFinalDetermination.complianceRestored) &&
    (nonComplianceFinalDetermination.complianceRestored === 'YES'
      ? !isNil(nonComplianceFinalDetermination.complianceRestoredDate)
      : true) &&
    !!nonComplianceFinalDetermination.comments &&
    !isNil(nonComplianceFinalDetermination.reissuePenalty) &&
    !isNil(nonComplianceFinalDetermination.operatorPaid) &&
    (nonComplianceFinalDetermination.operatorPaid ? !isNil(nonComplianceFinalDetermination.operatorPaidDate) : true)
  );
};
