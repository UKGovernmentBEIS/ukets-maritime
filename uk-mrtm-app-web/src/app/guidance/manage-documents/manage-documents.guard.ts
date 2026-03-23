import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { isNil } from 'lodash-es';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';
import { ManageGuidanceDocumentDTO } from '@guidance/guidance.types';

export const canActivateManageDocumentForm =
  (prefix?: string): CanActivateFn =>
  (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
    const store = inject(GuidanceStore);
    const manageGuidance = store.select(guidanceQuery.selectManageGuidance)();

    return (
      (!isNil(manageGuidance?.type) && !isNil(manageGuidance.sectionId)) ||
      createUrlTreeFromSnapshot(activatedRouteSnapshot, [prefix ?? '../'])
    );
  };

export const canActivateManageDocumentsSummary =
  (prefix?: string): CanActivateFn =>
  (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
    const store = inject(GuidanceStore);
    const manageGuidance = store.select(guidanceQuery.selectManageGuidance)();
    const documentDto = manageGuidance?.object as ManageGuidanceDocumentDTO;

    return (
      (!isNil(documentDto?.title) &&
        !isNil(documentDto?.displayOrderNo) &&
        !isNil(documentDto?.sectionId) &&
        !isNil(documentDto?.file)) ||
      createUrlTreeFromSnapshot(activatedRouteSnapshot, [prefix ?? '../'])
    );
  };
