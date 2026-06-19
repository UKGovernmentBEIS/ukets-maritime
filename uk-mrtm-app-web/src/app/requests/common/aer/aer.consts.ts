import { InjectionToken } from '@angular/core';

import { AerMaterialityLevel, AerPort, AerShipEmissions, AerSiteVisit, AerVoyage } from '@mrtm/api';

import { RequestTaskState, StateSelector } from '@netz/common/store';

import { SubTaskListMap } from '@shared/types';

export const AER_ROUTE_PREFIX = 'aer';
export const AER_VERIFICATION_SUBMIT_ROUTE_PREFIX = 'verify-aer';
export const AER_AMEND_ROUTE_PREFIX = 'aer-amend';

export const AER_SUBTASK_LIST_MAP: InjectionToken<SubTaskListMap<any>> = new InjectionToken<SubTaskListMap<any>>(
  'Aer subtask list map',
);

export const AER_EMISSIONS_CALCULATIONS_STEP = 'emissions-calculations';
export const AER_SELECT_SHIP_STEP = 'select-ship';
export const AER_DIRECT_EMISSIONS_STEP = 'direct-emissions';
export const AER_DELETE_DIRECT_EMISSIONS_STEP = 'delete-direct-emissions';
export const AER_FUEL_CONSUMPTION_STEP = 'fuel-consumption';
export const AER_DELETE_FUEL_CONSUMPTION_STEP = 'delete-fuel-consumption';

export const AER_SUBTASK: InjectionToken<string> = new InjectionToken<string>('Aer subtask');
export const AER_OBJECT_ROUTE_KEY: InjectionToken<string> = new InjectionToken<string>('Aer object route key');
export const AER_RELATED_SHIP_SELECTOR = new InjectionToken<
  (objectId: (AerPort | AerVoyage)['uniqueIdentifier']) => StateSelector<RequestTaskState, AerShipEmissions>
>('Aer related ship selector');

export const AER_SITE_VISIT_TYPES: AerSiteVisit['type'][] = ['IN_PERSON', 'VIRTUAL'] as const;
export const AER_ACCREDITATION_REFERENCE_DOCUMENT_TYPES: AerMaterialityLevel['accreditationReferenceDocumentTypes'] = [
  'SI_2020_1265',
  'EN_ISO_14065_2020',
  'EN_ISO_14064_3_2019',
  'IAF_MD_6_2023',
  'AUTHORITY_GUIDANCE',
  'OTHER',
] as const;

export const AER_VERIFIER_FINDINGS_STEP_EXIST_FORM = 'exist';
export const AER_VERIFIER_FINDINGS_STEP_ITEMS_LIST = 'list';
export const AER_VERIFIER_FINDINGS_STEP_ITEM_FORM_ADD = 'add';
export const AER_VERIFIER_FINDINGS_STEP_ITEM_FORM_EDIT = 'edit';
export const AER_VERIFIER_FINDINGS_STEP_ITEM_DELETE = 'remove';

export const AER_VERIFICATION_RETURN_TO_OPERATOR_ROUTE = 'return-for-changes';
