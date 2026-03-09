import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { isNil } from 'lodash-es';

import { SaveGuidanceSectionDTO } from '@mrtm/api';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';

export const canActivateManageSectionForm =
  (prefix?: string): CanActivateFn =>
  (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
    const store = inject(GuidanceStore);
    const manageGuidance = store.select(guidanceQuery.selectManageGuidance)();

    return (
      manageGuidance?.type === 'CREATE' ||
      (['UPDATE', 'DELETE'].includes(manageGuidance?.type) && !isNil(manageGuidance?.sectionId)) ||
      createUrlTreeFromSnapshot(activatedRouteSnapshot, [prefix ?? '../'])
    );
  };

export const canActivateManageSectionSummary =
  (prefix?: string): CanActivateFn =>
  (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
    const store = inject(GuidanceStore);
    const manageGuidance = store.select(guidanceQuery.selectManageGuidance)();
    const sectionDto = manageGuidance?.object as SaveGuidanceSectionDTO;

    return (
      (!isNil(sectionDto?.name) && !isNil(sectionDto?.displayOrderNo)) ||
      createUrlTreeFromSnapshot(activatedRouteSnapshot, [prefix ?? '../'])
    );
  };
