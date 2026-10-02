import { InjectionToken } from '@angular/core';
import { FormGroup } from '@angular/forms';

export const CUSTOM_REPORTS_ROUTE_PREFIX = 'custom-reports';
export const MI_CUSTOM_REPORTS_FORM = new InjectionToken<FormGroup>('MI_CUSTOM_REPORTS_FORM');
export enum MiReportFormMode {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
}
