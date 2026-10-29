import { TestBed } from '@angular/core/testing';
import { PartialMatchRouteSnapshot, Route, UrlSegment } from '@angular/router';

import { firstValueFrom, isObservable, Observable, of } from 'rxjs';

import { UIConfigurationService } from '@mrtm/api';

import { ConfigStore } from '@core/config/config.store';
import { isConfigPropertyEnabled } from '@core/config/feature.guard';

describe('isConfigPropertyEnabled', () => {
  let store: ConfigStore;

  const runGuard = (): Promise<boolean> => {
    const result = TestBed.runInInjectionContext(() =>
      isConfigPropertyEnabled('requestFeedbackEnabled')(
        {} as Route,
        [] as UrlSegment[],
        {} as PartialMatchRouteSnapshot,
      ),
    );

    return isObservable(result) ? firstValueFrom(result as Observable<boolean>) : Promise.resolve(result as boolean);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UIConfigurationService, useValue: { getUIFlags: () => of({}) } }],
    });
    store = TestBed.inject(ConfigStore);
  });

  it('should match when the property is enabled', async () => {
    store.setState({ ...store.getState(), properties: { requestFeedbackEnabled: 'true' } });

    await expect(runGuard()).resolves.toBe(true);
  });

  it('should not match when the property is disabled', async () => {
    store.setState({ ...store.getState(), properties: { requestFeedbackEnabled: 'false' } });

    await expect(runGuard()).resolves.toBe(false);
  });

  it('should not match when the property is missing', async () => {
    store.setState({ ...store.getState(), properties: {} });

    await expect(runGuard()).resolves.toBe(false);
  });
});
