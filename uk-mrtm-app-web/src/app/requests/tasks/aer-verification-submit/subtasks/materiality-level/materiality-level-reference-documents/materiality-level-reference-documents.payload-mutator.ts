import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerMaterialityLevel, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { MATERIALITY_LEVEL_SUB_TASK, MaterialityLevelStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class MaterialityLevelReferenceDocumentsPayloadMutator extends PayloadMutator {
  readonly subtask = MATERIALITY_LEVEL_SUB_TASK;
  readonly step = MaterialityLevelStep.REFERENCE_DOCUMENTS;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerMaterialityLevel, 'accreditationReferenceDocumentTypes' | 'otherReference'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        payload.verificationReport.materialityLevel = {
          ...payload.verificationReport.materialityLevel,
          accreditationReferenceDocumentTypes: userInput.accreditationReferenceDocumentTypes,
          otherReference: userInput.otherReference,
        };
      }),
    );
  }
}
