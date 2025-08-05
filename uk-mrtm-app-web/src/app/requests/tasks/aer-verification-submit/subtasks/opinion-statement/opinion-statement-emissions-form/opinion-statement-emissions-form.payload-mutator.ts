import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerOpinionStatement, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OPINION_STATEMENT_SUB_TASK, OpinionStatementStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class OpinionStatementEmissionsFormPayloadMutator extends PayloadMutator {
  readonly subtask = OPINION_STATEMENT_SUB_TASK;
  readonly step = OpinionStatementStep.EMISSIONS_FORM;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<
      AerOpinionStatement,
      | 'emissionsCorrect'
      | 'manuallyProvidedTotalEmissions'
      | 'manuallyProvidedLessIslandFerryDeduction'
      | 'manuallyProvidedLess5PercentIceClassDeduction'
      | 'manuallyProvidedSurrenderEmissions'
    >,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (!payload.verificationReport.opinionStatement) {
          payload.verificationReport.opinionStatement = {} as AerOpinionStatement;
        }

        payload.verificationReport.opinionStatement = { ...payload.verificationReport.opinionStatement, ...userInput };

        if (userInput.emissionsCorrect === true) {
          delete payload.verificationReport.opinionStatement.manuallyProvidedTotalEmissions;
          delete payload.verificationReport.opinionStatement.manuallyProvidedLess5PercentIceClassDeduction;
          delete payload.verificationReport.opinionStatement.manuallyProvidedLessIslandFerryDeduction;
          delete payload.verificationReport.opinionStatement.manuallyProvidedSurrenderEmissions;
        }
      }),
    );
  }
}
