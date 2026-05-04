import { Pipe, PipeTransform } from '@angular/core';

import { OrganisationStructure } from '@mrtm/api';

const legalStatusTitleMap: Record<OrganisationStructure['legalStatusType'], string> = {
  INDIVIDUAL: 'Full name',
  LIMITED_COMPANY: 'Company registration number',
  PARTNERSHIP: 'Name of the partnership',
};

@Pipe({
  name: 'organisationStructureTitle',
  standalone: true,
})
export class OrganisationStructureTitlePipe implements PipeTransform {
  transform(value: OrganisationStructure['legalStatusType']): string | null {
    return legalStatusTitleMap?.[value] ?? null;
  }
}
