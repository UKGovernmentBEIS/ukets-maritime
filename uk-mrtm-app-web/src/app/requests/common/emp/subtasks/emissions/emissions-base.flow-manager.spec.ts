import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Params, provideRouter, Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmissionsFlowManager } from '@requests/common/emp/subtasks/emissions/emissions.flow-manager';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { EmissionsBaseFlowManager } from '@requests/common/emp/subtasks/emissions/emissions-base.flow-manager';
import { EmissionsReviewFlowManager } from '@requests/common/emp/subtasks/emissions/emissions-review.flow-manager';
import { EmissionsVariationRegulatorFlowManager } from '@requests/common/emp/subtasks/emissions/emissions-variation-regulator.flow-manager';

describe('Emissions flow managers', () => {
  const createRoute = (queryParams: Params = {}) =>
    ({ snapshot: { queryParamMap: convertToParamMap(queryParams) } }) as unknown as ActivatedRoute;

  describe.each([
    ['EmissionsFlowManager', EmissionsFlowManager],
    ['EmissionsReviewFlowManager', EmissionsReviewFlowManager],
    ['EmissionsVariationRegulatorFlowManager', EmissionsVariationRegulatorFlowManager],
  ])('%s', (_, flowManagerType: new () => EmissionsBaseFlowManager) => {
    let flowManager: EmissionsBaseFlowManager;
    let navigateSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideRouter([]), flowManagerType] });
      flowManager = TestBed.inject(flowManagerType);
      navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    });

    it('should handle the emissions subtask', () => {
      expect(flowManager.subtask).toBe(EMISSIONS_SUB_TASK);
    });

    it('should return to the fuels list keeping change=true after changing a fuel', async () => {
      const route = createRoute({ change: 'true' });

      await firstValueFrom(flowManager.nextStep(EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM, route));

      expect(navigateSpy).toHaveBeenCalledWith([`../../${EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`], {
        relativeTo: route,
        queryParams: { change: true },
      });
    });

    it('should return to the emission sources list keeping change=true after changing an emission source', async () => {
      const route = createRoute({ change: 'true' });

      await firstValueFrom(flowManager.nextStep(EmissionsWizardStep.EMISSION_SOURCES_FORM, route));

      expect(navigateSpy).toHaveBeenCalledWith([`../../${EmissionsWizardStep.EMISSION_SOURCES_LIST}`], {
        relativeTo: route,
        queryParams: { change: true },
      });
    });

    it('should return to the fuels list without change when the fuel was not opened as a change', async () => {
      const route = createRoute();

      await firstValueFrom(flowManager.nextStep(EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM, route));

      expect(navigateSpy).toHaveBeenCalledWith([`../../${EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`], {
        relativeTo: route,
        queryParams: undefined,
      });
    });

    it('should not carry change=true to steps other than the fuel and emission source forms', async () => {
      const route = createRoute({ change: 'true' });

      await firstValueFrom(flowManager.nextStep(EmissionsWizardStep.BASIC_DETAILS, route));

      expect(navigateSpy).toHaveBeenCalledWith([`../${EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`], {
        relativeTo: route,
        queryParams: undefined,
      });
    });

    it('should go to the list of ships after saving the ship summary', async () => {
      await expect(firstValueFrom(flowManager.nextStepPath(EmissionsWizardStep.SHIP_SUMMARY))).resolves.toBe(
        `../../${EmissionsWizardStep.LIST_OF_SHIPS}`,
      );
    });
  });

  it('should go to the summary after the review decision', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), EmissionsReviewFlowManager] });

    await expect(
      firstValueFrom(TestBed.inject(EmissionsReviewFlowManager).nextStepPath(EmissionsWizardStep.DECISION)),
    ).resolves.toBe(EmissionsWizardStep.SUMMARY);
  });

  it('should go to the summary after the variation regulator decision', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), EmissionsVariationRegulatorFlowManager] });

    await expect(
      firstValueFrom(
        TestBed.inject(EmissionsVariationRegulatorFlowManager).nextStepPath(
          EmissionsWizardStep.VARIATION_REGULATOR_DECISION,
        ),
      ),
    ).resolves.toBe(EmissionsWizardStep.SUMMARY);
  });
});
