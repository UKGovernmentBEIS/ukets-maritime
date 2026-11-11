import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { AerPortsFlowManager } from '@requests/common/aer/subtasks/aer-ports/aer-ports.flow-manager';
import { AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { AerVoyagesFlowManager } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.flow-manager';
import { AerVoyagesWizardStep } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';

describe('AER voyages and ports flow managers', () => {
  const route = {} as ActivatedRoute;

  describe.each([
    ['AerVoyagesFlowManager', AerVoyagesFlowManager, AerVoyagesWizardStep.DIRECT_EMISSIONS],
    ['AerPortsFlowManager', AerPortsFlowManager, AerPortsWizardStep.DIRECT_EMISSIONS],
  ])('%s', (_, flowManagerType: new () => WizardFlowManager, directEmissionsStep: string) => {
    let flowManager: WizardFlowManager;
    let navigateSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideRouter([]), flowManagerType] });
      flowManager = TestBed.inject(flowManagerType);
      navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    });

    it('should return to the emissions page in change mode after saving direct emissions', async () => {
      await expect(firstValueFrom(flowManager.nextStep(directEmissionsStep, route))).resolves.toBe('../');

      expect(navigateSpy).toHaveBeenCalledWith(['../'], {
        relativeTo: route,
        queryParams: { change: true },
        fragment: 'directEmissions',
      });
    });

    it('should keep the default navigation for the other steps', async () => {
      await firstValueFrom(flowManager.nextStep('unknown-step', route));

      expect(navigateSpy).toHaveBeenCalledWith(['../../'], { relativeTo: route });
    });
  });
});
