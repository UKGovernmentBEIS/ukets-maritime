import { NonComplianceFinalDetermination } from '@mrtm/api';

import { isNil } from '@shared/utils';

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
