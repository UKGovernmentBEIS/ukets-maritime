import { inject, Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AerPort } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { AER_OBJECT_ROUTE_KEY } from '@requests/common/aer/aer.consts';
import { AER_SELECT_SHIP_QUERY_SELECTOR } from '@requests/common/aer/components/aer-select-ship/aer-select-ship.consts';
import { AerSelectShipFormGroupModel } from '@requests/common/aer/components/aer-select-ship/aer-select-ship.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export const aerSelectShipFormGroupProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, ActivatedRoute, AER_OBJECT_ROUTE_KEY, RequestTaskStore],
  useFactory: (
    fb: FormBuilder,
    route: ActivatedRoute,
    routeParamName: string,
    store: RequestTaskStore,
  ): FormGroup<AerSelectShipFormGroupModel> => {
    const stateSelector = inject(AER_SELECT_SHIP_QUERY_SELECTOR);
    const objectId = route.snapshot.params?.[routeParamName];
    const data = store.select(stateSelector(objectId))();

    return fb.group({
      uniqueIdentifier: fb.control<AerPort['uniqueIdentifier'] | null>(objectId ?? crypto.randomUUID()),
      imoNumber: fb.control<AerPort['imoNumber']>(data?.imoNumber, {
        validators: [GovukValidators.required('Select ship')],
      }),
    });
  },
};
