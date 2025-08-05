import { map, OperatorFunction, pipe } from 'rxjs';

import { ConfigPropertiesName, ConfigState, FeatureName } from '@core/config/config.state';

export const selectIsFeatureEnabled = (feature: FeatureName): OperatorFunction<ConfigState, boolean> =>
  pipe(map((state) => state.features[feature]));

export const selectConfigProperty = (property: ConfigPropertiesName): OperatorFunction<ConfigState, string> =>
  pipe(map((state) => state.properties[property]));

export const selectGtmContainerId: OperatorFunction<ConfigState, string> = pipe(
  map((state) => state.analytics.gtmContainerId),
);
