import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  ReductionClaimFuelPurchaseFormGroupModel,
  ReductionClaimFuelPurchaseFormModel,
} from '@requests/common/aer/subtasks/reduction-claim/reduction-claim-fuel-purchase/reduction-claim-fuel-purchase.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';
import { bigNumberUtils } from '@shared/utils';

export const reductionClaimFuelPurchaseFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute, RequestTaskFileService],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
    route: ActivatedRoute,
    fileService: RequestTaskFileService,
  ): FormGroup<ReductionClaimFuelPurchaseFormGroupModel> => {
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    const aerAttachments = store.select(aerCommonQuery.selectAerAttachments)();
    const fuelPurchaseId = route?.snapshot?.params?.['fuelPurchaseId'];
    const fuelPurchase = store.select(aerCommonQuery.selectReductionClaimFuelPurchase(fuelPurchaseId))();

    return formBuilder.group<ReductionClaimFuelPurchaseFormGroupModel>({
      fuelOriginTypeName: formBuilder.control<ReductionClaimFuelPurchaseFormModel['fuelOriginTypeName'] | null>(
        fuelPurchase?.fuelOriginTypeName?.uniqueIdentifier ?? null,
        {
          validators: GovukValidators.required('Select a fuel type'),
        },
      ),
      batchNumber: formBuilder.control<ReductionClaimFuelPurchaseFormModel['batchNumber'] | null>(
        fuelPurchase?.batchNumber ?? null,
        {
          validators: [
            GovukValidators.required('Enter a batch number'),
            GovukValidators.maxLength(500, 'Enter up to 500 characters'),
          ],
        },
      ),
      smfMass: formBuilder.control<ReductionClaimFuelPurchaseFormModel['smfMass'] | null>(
        fuelPurchase?.smfMass ?? null,
        {
          validators: [
            GovukValidators.required('Enter a total mass of sustainable fuel claimed from the batch'),
            GovukValidators.notNaN('Enter a numerical value'),
            GovukValidators.positiveNumber(
              'The total mass of sustainable fuel claimed from the batch should be greater than 0 ',
            ),
            GovukValidators.maxDecimalsValidator(5),
          ],
        },
      ),
      co2Emissions: formBuilder.control<ReductionClaimFuelPurchaseFormModel['co2Emissions'] | null>(
        fuelPurchase?.co2Emissions ? bigNumberUtils.getFixed(fuelPurchase.co2Emissions, 7) : null,
        {
          validators: [
            GovukValidators.min(
              0,
              'The total mass of sustainable fuel claimed from the batch should be greater than or equal 0',
            ),
          ],
        },
      ),
      co2EmissionFactor: formBuilder.control<ReductionClaimFuelPurchaseFormModel['co2EmissionFactor'] | null>(
        fuelPurchase?.co2EmissionFactor ?? null,
        {
          validators: [
            GovukValidators.required('Enter emission factor for carbon dioxide'),
            GovukValidators.notNaN('Enter a numerical value'),
            GovukValidators.positiveOrZeroNumber(
              'The emission factor for carbon dioxide should be greater than or equal 0',
            ),
            GovukValidators.maxIntegerAndDecimalsValidator(12, 5),
          ],
        },
      ),

      evidenceFiles: fileService.buildFormControl(
        requestTaskId,
        fuelPurchase?.evidenceFiles ?? [],
        aerAttachments,
        taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
        true,
        !isEditable,
      ),
    });
  },
};
