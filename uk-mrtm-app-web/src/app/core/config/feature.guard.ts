import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';

import { map, take } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { ConfigPropertiesName, FeatureName } from '@core/config/config.state';

export function isFeatureEnabled(feature: FeatureName): CanMatchFn {
  return () => inject(ConfigService).isFeatureEnabled(feature);
}

export function isConfigPropertyEnabled(property: ConfigPropertiesName): CanMatchFn {
  return () =>
    inject(ConfigService)
      .getConfigProperty(property)
      .pipe(
        take(1),
        map((value) => String(value) === 'true'),
      );
}
