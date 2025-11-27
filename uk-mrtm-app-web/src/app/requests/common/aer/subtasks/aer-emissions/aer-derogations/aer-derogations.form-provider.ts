import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerDerogationsFormGroup } from '@requests/common/aer/subtasks/aer-emissions/aer-derogations/aer-derogations.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export const aerDerogationsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (
    fb: FormBuilder,
    store: RequestTaskStore,
    activatedRoute: ActivatedRoute,
  ): FormGroup<AerDerogationsFormGroup> => {
    const shipId = activatedRoute.snapshot.params.shipId;
    const derogations = store.select(aerCommonQuery.selectShipDerogations(shipId))();

    return fb.group<AerDerogationsFormGroup>({
      uniqueIdentifier: fb.control(shipId),
      exceptionFromPerVoyageMonitoring: fb.control<boolean>(derogations?.exceptionFromPerVoyageMonitoring, {
        validators: [GovukValidators.required('Select yes if you have an exemption from per voyage monitoring')],
      }),
    });
  },
};
