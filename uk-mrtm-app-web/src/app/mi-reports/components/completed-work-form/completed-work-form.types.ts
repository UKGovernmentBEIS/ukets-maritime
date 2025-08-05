import { FormControl } from '@angular/forms';

export interface CompletedWorkFormModel {
  option: 'LAST_30_DAYS' | 'ANNUAL' | 'CUSTOM_PERIOD';
  year?: number;
  fromDate?: Date;
  toDate?: Date;
}

export type CompleteWorkFormGroupModel = Record<keyof CompletedWorkFormModel, FormControl>;
