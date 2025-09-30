import { Provider } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PAYLOAD_MUTATORS, PayloadMutator } from '@netz/common/forms';

import {
  NonComplianceDetailsBase,
  NonComplianceUnionPayload,
} from '@requests/common/non-compliance/non-compliance.types';

export const provideNonComplianceDetailsBasePayloadMutator = (subtask: string, step: string): Provider => ({
  provide: PAYLOAD_MUTATORS,
  multi: true,
  useFactory: () => {
    return {
      subtask: subtask,
      step: step,

      apply: (
        currentPayload: NonComplianceUnionPayload,
        userInput: NonComplianceDetailsBase,
      ): Observable<NonComplianceUnionPayload> => {
        return of(
          produce(currentPayload, (payload) => {
            payload.reason = userInput.reason;
            payload.nonComplianceDate = userInput.nonComplianceDate;
            payload.complianceDate = userInput.complianceDate;
            payload.nonComplianceComments = userInput.nonComplianceComments;
          }),
        );
      },
    } as PayloadMutator;
  },
});
