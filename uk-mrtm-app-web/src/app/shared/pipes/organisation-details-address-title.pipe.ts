import { Pipe, PipeTransform } from '@angular/core';

import { OrganisationStructure } from '@mrtm/api';

const legalStatusAddressMap: Record<OrganisationStructure['legalStatusType'], string> = {
  INDIVIDUAL: 'Address',
  LIMITED_COMPANY: 'Registered address',
  PARTNERSHIP: 'Main office address',
};

@Pipe({
  name: 'organisationDetailsAddressTitle',
  standalone: true,
})
export class OrganisationDetailsAddressTitlePipe implements PipeTransform {
  transform(value: OrganisationStructure['legalStatusType']): string | null {
    return legalStatusAddressMap?.[value] ?? null;
  }
}
