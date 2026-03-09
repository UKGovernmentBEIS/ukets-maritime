import { Provider } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { isNil } from 'lodash-es';

import { EmpShipEmissions } from '@mrtm/api';

import { SIDE_EFFECTS } from '@netz/common/forms';

import { EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP } from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.helper';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AllFuels } from '@shared/types';

const sourcesDependencyCheck = (
  currentPayload: EmpShipEmissions,
  modifiedShips: Set<string>,
  sectionsCompleted?: EmpTaskPayload['empSectionsCompleted'],
): EmpShipEmissions => {
  return produce(currentPayload, (payload) => {
    const fuelOrigin = (payload.fuelsAndEmissionsFactors ?? []).map(
      (fuel) => `${fuel?.origin}-${(fuel as AllFuels)?.type}-${fuel.name ?? ''}`,
    );

    const currentEmissionSourcesCount = payload?.emissionsSources?.length ?? 0;
    const incompletedEmissionSources: Set<EmpShipEmissions['uniqueIdentifier']> = new Set();

    payload.emissionsSources = (payload?.emissionsSources ?? []).map((emissionSource) => {
      const currentFuelCount = emissionSource?.fuelDetails?.length ?? 0;

      const fuelDetails = emissionSource.fuelDetails.filter((fuel: AllFuels) =>
        fuelOrigin.includes(`${fuel.origin}-${fuel.type}-${fuel.name ?? ''}`),
      );

      if (fuelDetails.length !== currentFuelCount) {
        incompletedEmissionSources.add(emissionSource.uniqueIdentifier);
      }

      return {
        ...emissionSource,
        fuelDetails,
      };
    });

    for (const incompletedEmissionSource of incompletedEmissionSources) {
      sectionsCompleted[`${EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP}-${incompletedEmissionSource}`] =
        TaskItemStatus.NEEDS_REVIEW;
    }

    if (currentEmissionSourcesCount !== (payload?.emissionsSources?.length ?? 0)) {
      modifiedShips.add(payload?.uniqueIdentifier);
    }
  });
};

const uncertaintyLevelCheck = (currentPayload: EmpShipEmissions, modifiedShips: Set<string>): EmpShipEmissions => {
  return produce(currentPayload, (payload) => {
    const methods = Array.from(new Set((payload?.emissionsSources ?? []).map((x) => x.monitoringMethod).flat()));
    const uncertaintyLevelCount = payload?.uncertaintyLevel?.length ?? 0;

    payload.uncertaintyLevel = (payload?.uncertaintyLevel ?? []).filter((x) => methods.includes(x.monitoringMethod));

    if (uncertaintyLevelCount !== (payload?.uncertaintyLevel?.length ?? 0)) {
      modifiedShips.add(payload?.uniqueIdentifier);
    }
  });
};

const measurementsCheck = (currentPayload: EmpShipEmissions, modifiedShips: Set<string>): EmpShipEmissions => {
  return produce(currentPayload, (payload) => {
    const emissionSources = (payload?.emissionsSources ?? []).map((emissionSource) => emissionSource.name);
    const measurementsCount = payload?.measurements?.length ?? 0;

    payload.measurements = (payload?.measurements ?? []).filter((measurement) =>
      measurement?.emissionSources?.every((emissionSource) => emissionSources.includes(emissionSource)),
    );

    if (measurementsCount !== (payload?.measurements?.length ?? 0)) {
      modifiedShips.add(payload?.uniqueIdentifier);
    }
  });
};

const carbonCaptureCheck = (currentPayload: EmpShipEmissions, modifiedShips: Set<string>): EmpShipEmissions => {
  return produce(currentPayload, (payload) => {
    const emissionSources = (payload?.emissionsSources ?? []).map((emissionSource) => emissionSource.name);

    if (!payload?.carbonCapture?.exist) {
      return;
    }

    if (
      !payload?.carbonCapture?.technologies?.technologyEmissionSources.every((emissionSource) =>
        emissionSources.includes(emissionSource),
      )
    ) {
      payload.carbonCapture = {
        ...payload?.carbonCapture,
        technologies: {
          ...payload?.carbonCapture?.technologies,
          technologyEmissionSources: payload?.carbonCapture?.technologies?.technologyEmissionSources.filter(
            (emissionSource) => emissionSources.includes(emissionSource),
          ),
        },
      };

      modifiedShips.add(payload?.uniqueIdentifier);
    }
  });
};

const dependenciesMap: Record<
  string,
  (
    payload: EmpShipEmissions,
    modifiedShipsMap: Set<string>,
    sectionsCompleted?: EmpTaskPayload['empSectionsCompleted'],
  ) => EmpShipEmissions
> = {
  [EmissionsWizardStep.EMISSION_SOURCES_FORM]: sourcesDependencyCheck,
  [EmissionsWizardStep.UNCERTAINTY_LEVEL]: uncertaintyLevelCheck,
  [EmissionsWizardStep.MEASUREMENTS]: measurementsCheck,
  [EmissionsWizardStep.CARBON_CAPTURE]: carbonCaptureCheck,
};

const subtaskDependencies: Record<string, Array<EmissionsWizardStep>> = {
  [EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM]: [EmissionsWizardStep.EMISSION_SOURCES_FORM],
  [EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST]: [EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM],
  [EmissionsWizardStep.EMISSION_SOURCES_FORM]: [
    EmissionsWizardStep.UNCERTAINTY_LEVEL,
    EmissionsWizardStep.MEASUREMENTS,
    EmissionsWizardStep.CARBON_CAPTURE,
  ],
  [EmissionsWizardStep.EMISSION_SOURCES_LIST]: [EmissionsWizardStep.EMISSION_SOURCES_FORM],
};

export const provideEmissionDependenciesSideEffect = (step: EmissionsWizardStep): Provider => ({
  provide: SIDE_EFFECTS,
  multi: true,
  useFactory: () => {
    return {
      subtask: EMISSIONS_SUB_TASK,
      step: step,
      on: ['SAVE_SUBTASK'],

      apply: (currentPayload: EmpTaskPayload): Observable<any> => {
        return of(
          produce(currentPayload, (payload: EmpTaskPayload) => {
            if (!payload.emissionsMonitoringPlan.emissions.ships) {
              return;
            }

            const modifiedShipsIds: Set<string> = new Set<string>();

            payload.emissionsMonitoringPlan.emissions.ships = (
              payload?.emissionsMonitoringPlan?.emissions?.ships ?? []
            ).map((ship) => {
              let currentDependencies = subtaskDependencies[step];

              while (currentDependencies) {
                for (const dependency of currentDependencies) {
                  if (dependenciesMap?.[dependency]) {
                    ship = dependenciesMap?.[dependency]?.(ship, modifiedShipsIds, payload.empSectionsCompleted);
                  }
                  currentDependencies = subtaskDependencies[dependency];
                }
              }

              if (modifiedShipsIds.size) {
                payload.empSectionsCompleted[EMISSIONS_SUB_TASK] = TaskItemStatus.IN_PROGRESS;

                for (const shipId of modifiedShipsIds) {
                  if (!isNil(shipId)) {
                    payload.empSectionsCompleted[`${EMISSIONS_SUB_TASK}-ship-${shipId}`] = TaskItemStatus.IN_PROGRESS;
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
