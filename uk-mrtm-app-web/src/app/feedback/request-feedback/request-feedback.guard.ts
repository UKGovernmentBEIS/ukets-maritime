import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { map, of, switchMap, take } from 'rxjs';

import { BusinessErrorService } from '@netz/common/error';

import { ConfigService } from '@core/config';
import { feedbackNotAvailableError } from '@feedback/request-feedback/request-feedback.config';

export const canActivateRequestFeedback: CanActivateFn = () => {
  const businessErrorService = inject(BusinessErrorService);

  return inject(ConfigService)
    .getConfigProperty('requestFeedbackEnabled')
    .pipe(
      take(1),
      map((value) => String(value) === 'true'),
      switchMap((isEnabled) => (isEnabled ? of(true) : businessErrorService.showError(feedbackNotAvailableError()))),
    );
};
