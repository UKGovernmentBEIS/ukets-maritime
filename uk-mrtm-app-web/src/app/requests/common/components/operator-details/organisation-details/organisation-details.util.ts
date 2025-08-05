import { OrganisationStructure, PartnershipOrganisation } from '@mrtm/api';

import { UploadedFile } from '@shared/types';
import { createFileUploadPayload } from '@shared/utils';

export const getOrganisationStructureFromUserInput = (
  userInput: Omit<OrganisationStructure, 'sameAsContactAddress'> &
    Partial<PartnershipOrganisation> & {
      registrationNumber?: string;
      fullName?: string;
      evidenceFiles?: UploadedFile[];
      sameAsContactAddress?: Array<boolean>;
    },
  legalStatusType: OrganisationStructure['legalStatusType'],
): OrganisationStructure => {
  return {
    legalStatusType: legalStatusType,
    registeredAddress: userInput.registeredAddress,
    fullName: userInput?.fullName,
    sameAsContactAddress: userInput?.sameAsContactAddress?.includes(true) ?? false,
    registrationNumber: userInput?.registrationNumber,
    ...(legalStatusType === 'PARTNERSHIP' && {
      partnershipName: userInput?.partnershipName,
      partners: userInput?.partners,
    }),
    ...(legalStatusType === 'LIMITED_COMPANY' && {
      evidenceFiles: createFileUploadPayload(userInput?.evidenceFiles),
    }),
  } as OrganisationStructure;
};
