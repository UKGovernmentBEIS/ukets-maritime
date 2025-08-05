import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { getMethaneSlipFromUserInput } from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.helper';
import { EmissionSourcesAndFuelTypesUsedFormType } from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.types';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AllFuels } from '@shared/types';

export class AerEmissionSourcesAndFuelTypesUsedFormPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.EMISSION_SOURCES_FORM;

  public apply(currentPayload: any, userInput: EmissionSourcesAndFuelTypesUsedFormType): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, shipId, fuelDetails, ...formData } = userInput;
        const editedShip = payload.aer[this.subtask]?.ships?.find((ship) => ship.uniqueIdentifier === shipId);
        const editedItem = editedShip.emissionsSources.find((item) => item.uniqueIdentifier === uniqueIdentifier);

        const fuelDetailsDto = fuelDetails.map((fuelDetail) => {
          const { methaneSlipValue, methaneSlipValueType } = getMethaneSlipFromUserInput(
            fuelDetail?.methaneSlip,
            fuelDetail?.methaneSlipOther,
          );
          const fuelFactor = editedShip.fuelsAndEmissionsFactors.find(
            (item) => item.uniqueIdentifier === fuelDetail.uniqueIdentifier,
          ) as AllFuels;

          return {
            uniqueIdentifier: fuelDetail.uniqueIdentifier,
            origin: fuelFactor.origin,
            name: fuelFactor.name,
            type: fuelFactor.type,
            methaneSlip: methaneSlipValue,
            methaneSlipValueType: methaneSlipValueType,
          };
        });

        const newItem = {
          ...formData,
          fuelDetails: fuelDetailsDto,
          uniqueIdentifier,
        };

        const emissionsSources = editedItem
          ? editedShip.emissionsSources.map((item) => (item.uniqueIdentifier === uniqueIdentifier ? newItem : item))
          : [...editedShip.emissionsSources, newItem];

        payload.aer[this.subtask].ships = payload.aer[this.subtask].ships.map((ship) =>
          ship.uniqueIdentifier === shipId ? { ...editedShip, emissionsSources } : ship,
        );

        payload.aerSectionsCompleted[`${this.subtask}-ship-${userInput.shipId}`] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
