import {
  GuidanceDocumentDTO,
  GuidanceSectionDTO,
  GuidanceSectionsResponseDTO,
  SaveGuidanceDocumentDTO,
  SaveGuidanceSectionDTO,
} from '@mrtm/api';

import { UploadedFile } from '@shared/types';

export type ManageGuidanceDocumentDTO = Omit<SaveGuidanceDocumentDTO, 'file'> & {
  sectionId: GuidanceSectionDTO['id'];
  file: UploadedFile;
};

export interface ManageGuidanceDTO {
  area: 'SECTIONS' | 'DOCUMENTS';
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  sectionId?: GuidanceSectionDTO['id'];
  documentId?: GuidanceDocumentDTO['id'];
  object?: SaveGuidanceSectionDTO | ManageGuidanceDocumentDTO;
}

export type GuidanceState = GuidanceSectionsResponseDTO & {
  manage?: ManageGuidanceDTO;
};
