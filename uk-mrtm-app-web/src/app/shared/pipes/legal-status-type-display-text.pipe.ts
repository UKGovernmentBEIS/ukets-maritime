import { Pipe, PipeTransform } from '@angular/core';

import { OrganisationStructure } from '@mrtm/api';

import { legalStatusTypeToDisplayTextTransformer } from '@shared/utils';

@Pipe({
  name: 'legalStatusTypeDisplayText',
  standalone: true,
})
export class LegalStatusTypeDisplayTextPipe implements PipeTransform {
  transform(value: OrganisationStructure['legalStatusType']): string {
    return legalStatusTypeToDisplayTextTransformer(value);
  }
}
