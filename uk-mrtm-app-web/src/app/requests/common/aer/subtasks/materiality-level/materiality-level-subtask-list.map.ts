import { SubTaskListMap } from '@shared/types';

export const materialityLevelMap: SubTaskListMap<{
  materialityDetails: string;
  accreditationReferenceDocumentTypes: string;
  otherReference: string;
}> = {
  title: 'Materiality level and reference documents held',
  caption: 'Materiality level and reference documents held',
  materialityDetails: {
    title: 'What is the materiality level?',
    caption: 'Materiality level',
  },
  accreditationReferenceDocumentTypes: {
    title: 'Accreditation reference documents',
    description: 'Select the reference documents that are appropriate to the accreditation you hold',
  },
  otherReference: { title: 'Reference details' },
};
