import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { batchVariationsQuery, BatchVariationStore } from '@batch-variations/+state';
import { BatchVariationService } from '@batch-variations/services/batch-variation.service';

export const batchVariationsGuard: CanActivateFn = (route) => {
  const service = inject(BatchVariationService);

  return service.loadBatchVariations((route?.queryParams?.page ?? 1) - 1);
};

export const canActivateCreateBatchVariation: CanActivateFn = (route) => {
  const service = inject(BatchVariationService);
  const store = inject(BatchVariationStore);
  const canActivateCreate = store.select(batchVariationsQuery.selectCanInitiateBatchReissue)();

  return (canActivateCreate && service.resetCurrentItem()) || createUrlTreeFromSnapshot(route, ['../']);
};
