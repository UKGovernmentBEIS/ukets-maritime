import { OrganisationStructure, RequestActionDTO } from '@mrtm/api';

export interface RegistryAccountUpdateDto {
  accountDetails: {
    competentAuthority?: RequestActionDTO['competentAuthority'];
    accountName?: string;
    companyImoNumber?: string;
    firstYearOfVerifiedEmissions?: number;
    monitoringPlanId?: string;
    registryId?: number;
  };
  organisationStructure: OrganisationStructure;
}
