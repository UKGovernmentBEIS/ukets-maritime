import { AerSiteVisitType } from '@requests/common/aer/aer.types';

export const aerSiteVisitTypeToLabelTransformer = (value: AerSiteVisitType): string | null => {
  switch (value) {
    case 'IN_PERSON':
      return 'In-person site visit';
    case 'VIRTUAL':
      return 'Virtual site visit';
    default:
      return null;
  }
};
