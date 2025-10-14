import { FormControl, FormGroup } from '@angular/forms';

export interface ManageDocumentsFromModel {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  sectionId: number;
  documentId?: number;
}

export type ManageDocumentsFormGroupModel = FormGroup<Record<keyof ManageDocumentsFromModel, FormControl>>;
