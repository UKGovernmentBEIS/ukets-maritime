import { OrganisationStructure } from '@mrtm/api';

export const legalStatusTypeToDisplayTextTransformer = (
  value: OrganisationStructure['legalStatusType'],
): string | null => {
  switch (value) {
    case 'INDIVIDUAL':
      return 'Individual';
    case 'LIMITED_COMPANY':
      return 'Company';
    case 'PARTNERSHIP':
      return 'Partnership';
    default:
      return null;
  }
};
