import { AerMaterialityLevel } from '@mrtm/api';

import { SubTaskListMap } from '@shared/types';

export const materialityLevelMap: SubTaskListMap<AerMaterialityLevel> = {
  title: 'Further information of relevance to the opinion',
  materialityDetails: {
    title: 'Materiality level',
  },
  accreditationReferenceDocumentTypes: {
    title: 'Select the reference documents that are appropriate to the accreditation you hold',
  },
};
