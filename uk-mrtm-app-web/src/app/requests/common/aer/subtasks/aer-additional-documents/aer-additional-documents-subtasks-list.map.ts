import { SubTaskListMap } from '@shared/types';

export const aerAdditionalDocumentsMap: SubTaskListMap<{
  additionalDocumentsUpload: string;
}> = {
  title: 'Additional documents and information',
  additionalDocumentsUpload: {
    title: 'Do you want to upload any additional documents or information?',
  },
};
