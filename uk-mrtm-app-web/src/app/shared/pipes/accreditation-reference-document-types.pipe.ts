import { Pipe, PipeTransform } from '@angular/core';

import { AerMaterialityLevel } from '@mrtm/api';

@Pipe({
  name: 'accreditationReferenceDocumentTypes',
  standalone: true,
  pure: true,
})
export class AccreditationReferenceDocumentTypesPipe implements PipeTransform {
  transform(value: AerMaterialityLevel['accreditationReferenceDocumentTypes'][number]): string {
    switch (value) {
      case 'SI_2020_1265':
        return 'The Greenhouse Gas Emissions Trading Scheme Order 2020 (SI 2020/1265)';
      case 'EN_ISO_14065_2020':
        return 'EN ISO 14065:2020 Requirements for greenhouse gas validation and verification bodies for use in accreditation or other forms of recognition';
      case 'EN_ISO_14064_3_2019':
        return 'EN ISO 14064-3:2019 Specification with guidance for the validation and verification of GHG assertions';
      case 'IAF_MD_6_2023':
        return 'IAF MD 6:2023 International Accreditation Forum (IAF) Mandatory Document for the Application of ISO 14065:2020 (Issue 3, November 2023)';
      case 'AUTHORITY_GUIDANCE':
        return 'Any guidance developed by the UK ETS Authority on verification and accreditation in relation to Maritime';
      case 'OTHER':
        return 'Add your own reference';

      default:
        return null;
    }
  }
}
