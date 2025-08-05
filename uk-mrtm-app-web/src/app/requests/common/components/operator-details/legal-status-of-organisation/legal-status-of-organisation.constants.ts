import { OrganisationStructure } from '@mrtm/api';

import { GovukSelectOption } from '@netz/govuk-components';

import { legalStatusTypeToDisplayTextTransformer } from '@shared/utils';

export const LEGAL_STATUS_TYPES: GovukSelectOption<OrganisationStructure['legalStatusType']>[] = [
  { text: legalStatusTypeToDisplayTextTransformer('LIMITED_COMPANY'), value: 'LIMITED_COMPANY' },
  { text: legalStatusTypeToDisplayTextTransformer('INDIVIDUAL'), value: 'INDIVIDUAL' },
  { text: legalStatusTypeToDisplayTextTransformer('PARTNERSHIP'), value: 'PARTNERSHIP' },
];
