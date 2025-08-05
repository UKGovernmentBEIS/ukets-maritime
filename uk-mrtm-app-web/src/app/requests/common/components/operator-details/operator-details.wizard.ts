import {
  AerOperatorDetails,
  EmpOperatorDetails,
  IndividualOrganisation,
  LimitedCompanyOrganisation,
  OrganisationStructure,
  PartnershipOrganisation,
} from '@mrtm/api';

const isOrganisationStructureCompleted = (organisationStructure: OrganisationStructure) => {
  const isRegisteredAddressCompleted =
    !!organisationStructure?.registeredAddress?.city &&
    !!organisationStructure?.registeredAddress?.country &&
    !!organisationStructure?.registeredAddress?.line1;

  switch (organisationStructure?.legalStatusType) {
    case 'LIMITED_COMPANY': {
      const limitedOrg = organisationStructure as LimitedCompanyOrganisation;
      return !!limitedOrg?.registrationNumber && isRegisteredAddressCompleted;
    }
    case 'INDIVIDUAL': {
      const individualOrg = organisationStructure as IndividualOrganisation;
      return !!individualOrg?.fullName && isRegisteredAddressCompleted;
    }
    case 'PARTNERSHIP': {
      const partnershipOrg = organisationStructure as PartnershipOrganisation;
      return partnershipOrg?.partners?.length > 0 && isRegisteredAddressCompleted;
    }
    default:
      return false;
  }
};

export const isOperatorDetailsCoreCompleted = (operatorDetails: EmpOperatorDetails | AerOperatorDetails) => {
  return (
    !!operatorDetails?.operatorName &&
    !!operatorDetails?.imoNumber &&
    !!operatorDetails?.contactAddress?.city &&
    !!operatorDetails?.contactAddress?.country &&
    !!operatorDetails?.contactAddress?.country &&
    isOrganisationStructureCompleted(operatorDetails?.organisationStructure)
  );
};
