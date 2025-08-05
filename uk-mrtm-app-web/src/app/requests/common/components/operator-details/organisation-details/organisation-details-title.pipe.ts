import { Pipe, PipeTransform } from '@angular/core';

import { OrganisationStructure } from '@mrtm/api';

@Pipe({
  name: 'organisationDetailsTitle',
  standalone: true,
})
export class OrganisationDetailsTitlePipe implements PipeTransform {
  transform(value: OrganisationStructure['legalStatusType']): string {
    switch (value) {
      case 'INDIVIDUAL':
        return 'Enter individual details';
      case 'LIMITED_COMPANY':
        return 'Enter company details';
      case 'PARTNERSHIP':
        return 'Enter partnership details';
    }
  }
}
