import { InjectionToken } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot, UrlTree } from '@angular/router';

import { CREATE_ACTION_TYPE } from '@requests/common/types/create-action-type.enum';
import { AerReInitiateStep } from '@requests/workflows/create-action/aer-re-initiate/aer-re-initiate.helpers';

export const CREATE_ACTION_REQUEST_TYPE_MAP: Record<keyof typeof CREATE_ACTION_TYPE, string> = {
  DOE: 'DOE',
  AER_REINITIATE: 'AER',
};

export const CREATE_ACTION: InjectionToken<CREATE_ACTION_TYPE> = new InjectionToken<CREATE_ACTION_TYPE>(
  'Create action',
);

export const CREATE_ACTION_SUCCESS_URL_MAP: Partial<
  Record<keyof typeof CREATE_ACTION_TYPE, (activatedRoute: ActivatedRouteSnapshot) => UrlTree>
> = {
  AER_REINITIATE: (activatedRoute: ActivatedRouteSnapshot): UrlTree =>
    createUrlTreeFromSnapshot(activatedRoute, ['../', AerReInitiateStep.SUCCESS]),
};
