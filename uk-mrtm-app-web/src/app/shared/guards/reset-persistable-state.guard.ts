import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { PersistablePaginationService } from '@shared/services';

export const resetPersistableStateGuard: CanActivateFn = () => {
  const service = inject(PersistablePaginationService);
  service.reset();

  return true;
};
