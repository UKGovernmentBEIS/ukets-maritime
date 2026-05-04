import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const submitBacklinkResolver = (summaryRoute: string, previousStepRoute: string) => {
  return () => {
    const router = inject(Router);
    const isChangeClicked = !!router.currentNavigation()?.finalUrl?.queryParams?.change;

    return isChangeClicked ? summaryRoute : `../${previousStepRoute}`;
  };
};
