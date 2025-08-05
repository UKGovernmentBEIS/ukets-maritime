import { Provider } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { isNil } from 'lodash-es';

import { AerShipEmissions } from '@mrtm/api';

import { SIDE_EFFECTS } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { FuelsAndEmissionsFactorsExtended } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

const emissionSourcesDependencyCheck = (
  currentPayload: AerShipEmissions,
  modifiedShipIds: Set<string>,
): AerShipEmissions => {
  return produce(currentPayload, (payload) => {
    const fuelOriginTypeNameList = (payload.fuelsAndEmissionsFactors ?? []).map(
      (fuel: FuelsAndEmissionsFactorsExtended) => getFuelOriginTypeNameString(fuel),
    );

    const currentEmissionSourcesCount = payload?.emissionsSources?.length ?? 0;

    payload.emissionsSources = (payload?.emissionsSources ?? []).filter((emissionSource) =>
      emissionSource.fuelDetails.every((fuel: FuelsAndEmissionsFactorsExtended) =>
        fuelOriginTypeNameList.includes(getFuelOriginTypeNameString(fuel)),
      ),
    );

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

const dependenciesMap: Record<string, (payload: AerShipEmissions, modifiedShipIds: Set<string>) => AerShipEmissions> = {
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
                    ship = dependenciesMap?.[dependency]?.(ship, modifiedShipIds);
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
