import { GovukWidthClass } from '../types';

export interface GovukTableColumn<T = any> {
  header: string;
  field: keyof T;
  widthClass?: GovukWidthClass | string;
  isSortable?: boolean;
  isHeader?: boolean;
  isNumeric?: boolean;
}

export interface SortEvent {
  column: GovukTableColumn['field'];
  direction: 'ascending' | 'descending';
}
