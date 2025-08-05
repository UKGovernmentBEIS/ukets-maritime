import { Pipe, PipeTransform } from '@angular/core';

import { OrganisationStructure } from '@mrtm/api';

@Pipe({
  name: 'organisationDetailsAddressTitle',
  standalone: true,
})
export class OrganisationDetailsAddressTitlePipe implements PipeTransform {
  transform(value: OrganisationStructure['legalStatusType']): string | null {
    switch (value) {
      case 'INDIVIDUAL':
        return 'Address';
      case 'LIMITED_COMPANY':
        return 'Registered address';
      case 'PARTNERSHIP':
        return 'Main office address';
      default:
        return null;
    }
  }
}
