import { FormControl, FormGroup } from '@angular/forms';

export interface ManageSectionsFromModel {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  sectionId?: number;
}

export type ManageSectionsFormGroupModel = FormGroup<Record<keyof ManageSectionsFromModel, FormControl>>;
