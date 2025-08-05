import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { PaymentApiService, PaymentService } from '@requests/tasks/payment/services';
import { MakePaymentFlowManager, PaymentMethodPayloadMutator } from '@requests/tasks/payment/subtasks/make';

export const providePaymentTaskServices = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskService, useClass: PaymentService },
    { provide: TaskApiService, useClass: PaymentApiService },
  ]);

export const providePaymentFlowManagers = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: MakePaymentFlowManager }]);

export const providePaymentPayloadMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: PAYLOAD_MUTATORS, multi: true, useClass: PaymentMethodPayloadMutator }]);
