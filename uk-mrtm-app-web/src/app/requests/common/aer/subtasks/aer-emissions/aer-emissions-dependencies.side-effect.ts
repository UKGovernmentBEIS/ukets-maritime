import { Provider } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { isNil } from 'lodash-es';

import { AerShipEmissions } from '@mrtm/api';

import { SIDE_EFFECTS } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP } from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.helper';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { FuelsAndEmissionsFactorsExtended } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AllFuels } from '@shared/types';

const emissionSourcesDependencyCheck = (
  currentPayload: AerShipEmissions,
  modifiedShipIds: Set<string>,
  sectionsCompleted: AerSubmitTaskPayload['aerSectionsCompleted'],
): AerShipEmissions => {
  return produce(currentPayload, (payload) => {
    const fuelOriginTypeNameList = (payload.fuelsAndEmissionsFactors ?? []).map(
      (fuel: FuelsAndEmissionsFactorsExtended) => getFuelOriginTypeNameString(fuel),
    );

    const currentEmissionSourcesCount = payload?.emissionsSources?.length ?? 0;
    const incompletedEmissionSources: Set<AerShipEmissions['uniqueIdentifier']> = new Set();

    payload.emissionsSources = (payload?.emissionsSources ?? []).map((emissionSource) => {
      const currentFuelCount = emissionSource?.fuelDetails?.length ?? 0;
      const fuelDetails = emissionSource.fuelDetails.filter((fuel: AllFuels) =>
        fuelOriginTypeNameList.includes(`${fuel.origin}-${fuel.type}-${fuel.name ?? ''}`),
      );

      if (fuelDetails.length !== currentFuelCount) {
        incompletedEmissionSources.add(emissionSource.uniqueIdentifier);
      }

      return {
        ...emissionSource,
        fuelDetails: emissionSource.fuelDetails.filter((fuel: AllFuels) =>
          fuelOriginTypeNameList.includes(`${fuel.origin}-${fuel.type}-${fuel.name ?? ''}`),
        ),
      };
    });

    for (const incompletedEmissionSource of incompletedEmissionSources) {
      sectionsCompleted[`${EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP}-${incompletedEmissionSource}`] =
        TaskItemStatus.NEEDS_REVIEW;
    }

    if (currentEmissionSourcesCount !== (payload?.emissionsSources?.length ?? 0)) {
      modifiedShipIds.add(payload?.uniqueIdentifier);
    }
  });
};

const getFuelOriginTypeNameString = (fuel: FuelsAndEmissionsFactorsExtended): string =>
  `${fuel.origin}-${fuel.type}-${fuel.name ?? ''}`;

const uncertaintyLevelCheck = (currentPayload: AerShipEmissions, modifiedShipIds: Set<string>): AerShipEmissions => {
  return produce(currentPayload, (payload) => {
    const methods = Array.from(new Set((payload?.emissionsSources ?? []).map((item) => item.monitoringMethod).flat()));
    const uncertaintyLevelCount = payload?.uncertaintyLevel?.length ?? 0;

    payload.uncertaintyLevel = (payload?.uncertaintyLevel ?? []).filter((uncertaintyLevel) =>
      methods.includes(uncertaintyLevel.monitoringMethod),
    );

    if (uncertaintyLevelCount !== (payload?.uncertaintyLevel?.length ?? 0)) {
      modifiedShipIds.add(payload?.uniqueIdentifier);
    }
  });
};

const dependenciesMap: Record<
  string,
  (
    payload: AerShipEmissions,
    modifiedShipIds: Set<string>,
    sectionsCompleted?: AerSubmitTaskPayload['aerSectionsCompleted'],
  ) => AerShipEmissions
> = {
  [AerEmissionsWizardStep.EMISSION_SOURCES_FORM]: emissionSourcesDependencyCheck,
  [AerEmissionsWizardStep.UNCERTAINTY_LEVEL]: uncertaintyLevelCheck,
};

const subtaskStepDependencies: Record<string, Array<AerEmissionsWizardStep>> = {
  [AerEmissionsWizardStep.FUELS_AND_EMISSIONS_LIST]: [AerEmissionsWizardStep.FUELS_AND_EMISSIONS_FORM],
  [AerEmissionsWizardStep.FUELS_AND_EMISSIONS_FORM]: [AerEmissionsWizardStep.EMISSION_SOURCES_FORM],
  [AerEmissionsWizardStep.EMISSION_SOURCES_LIST]: [AerEmissionsWizardStep.EMISSION_SOURCES_FORM],
  [AerEmissionsWizardStep.EMISSION_SOURCES_FORM]: [AerEmissionsWizardStep.UNCERTAINTY_LEVEL],
};

export const provideAerEmissionDependenciesSideEffect = (step: AerEmissionsWizardStep): Provider => ({
  provide: SIDE_EFFECTS,
  multi: true,
  useFactory: () => {
    return {
      subtask: EMISSIONS_SUB_TASK,
      step: step,
      on: ['SAVE_SUBTASK'],

      apply: (currentPayload: AerSubmitTaskPayload): Observable<any> => {
        return of(
          produce(currentPayload, (payload: AerSubmitTaskPayload) => {
            if (!payload.aer[EMISSIONS_SUB_TASK].ships) {
              return;
            }

            const modifiedShipIds = new Set<string>();

            payload.aer[EMISSIONS_SUB_TASK].ships = (payload?.aer?.[EMISSIONS_SUB_TASK]?.ships ?? []).map((ship) => {
              let currentDependencies = subtaskStepDependencies[step];

              while (currentDependencies) {
                for (const dependency of currentDependencies) {
                  if (dependenciesMap?.[dependency]) {
                    ship = dependenciesMap?.[dependency]?.(ship, modifiedShipIds, payload.aerSectionsCompleted);
                  }
                  currentDependencies = subtaskStepDependencies[dependency];
                }
              }

              if (modifiedShipIds.size) {
                payload.aerSectionsCompleted[EMISSIONS_SUB_TASK] = TaskItemStatus.IN_PROGRESS;

                for (const shipId of modifiedShipIds) {
                  if (!isNil(shipId)) {
                    payload.aerSectionsCompleted[`${EMISSIONS_SUB_TASK}-ship-${shipId}`] = TaskItemStatus.IN_PROGRESS;
                  }
                }
              }

              return ship;
            });
          }),
        );
      },
    };
  },
});
