import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { firstValueFrom, Observable, of } from 'rxjs';

import { UIConfigurationService } from '@mrtm/api';

import { BusinessErrorService } from '@netz/common/error';

import { ConfigStore } from '@core/config';
import { canActivateRequestFeedback } from '@feedback/request-feedback/request-feedback.guard';

describe('canActivateRequestFeedback', () => {
  let store: ConfigStore;
  const businessErrorService = { showError: vi.fn().mockReturnValue(of(false)) };

  const runGuard = (): Promise<boolean> =>
    firstValueFrom(
      TestBed.runInInjectionContext(() =>
        canActivateRequestFeedback({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
      ) as Observable<boolean>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: UIConfigurationService, useValue: { getUIFlags: () => of({}) } },
        { provide: BusinessErrorService, useValue: businessErrorService },
      ],
    });
    store = TestBed.inject(ConfigStore);
  });

  it('should activate when request feedback is enabled', async () => {
    store.setState({ ...store.getState(), properties: { requestFeedbackEnabled: 'true' } });

    await expect(runGuard()).resolves.toBe(true);
    expect(businessErrorService.showError).not.toHaveBeenCalled();
  });

  it('should show the not available error when request feedback is disabled', async () => {
    store.setState({ ...store.getState(), properties: { requestFeedbackEnabled: 'false' } });

    await expect(runGuard()).resolves.toBe(false);
    expect(businessErrorService.showError).toHaveBeenCalledWith(
      expect.objectContaining({ heading: 'This feedback form is not available' }),
    );
  });
});
