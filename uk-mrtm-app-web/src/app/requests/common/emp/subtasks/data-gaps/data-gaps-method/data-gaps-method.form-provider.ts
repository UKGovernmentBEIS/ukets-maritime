import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { TASK_FORM } from '@requests/common/task-form.token';

export const dataGapsMethodFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const dataGaps = store.select(empCommonQuery.selectDataGaps)();

    return fb.group(
      {
        formulaeUsed: fb.control(dataGaps?.formulaeUsed ?? null, {
          validators: [GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
        }),
        fuelConsumptionEstimationMethod: fb.control(dataGaps?.fuelConsumptionEstimationMethod ?? null, {
          validators: [
            GovukValidators.required('Enter a description of method to estimate fuel consumption'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        }),
        responsiblePersonOrPosition: fb.control(dataGaps?.responsiblePersonOrPosition ?? null, {
          validators: [
            GovukValidators.required('Enter the name of the person or position responsible for this method'),
            GovukValidators.maxLength(250, 'Enter up to 250 characters'),
          ],
        }),
        dataSources: fb.control(dataGaps?.dataSources ?? null, {
          validators: [
            GovukValidators.required('Enter the data sources'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        }),
        recordsLocation: fb.control(dataGaps?.recordsLocation ?? null, {
          validators: [
            GovukValidators.required('Enter the location where records are kept'),
            GovukValidators.maxLength(250, 'Enter up to 250 characters'),
          ],
        }),
        itSystemUsed: fb.control(dataGaps?.itSystemUsed ?? null, {
          validators: [GovukValidators.maxLength(250, 'Enter up to 250 characters')],
        }),
      },
      { updateOn: 'change' },
    );
  },
};
