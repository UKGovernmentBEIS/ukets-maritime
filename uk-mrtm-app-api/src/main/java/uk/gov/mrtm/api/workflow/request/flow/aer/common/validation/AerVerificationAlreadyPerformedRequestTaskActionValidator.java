package uk.gov.mrtm.api.workflow.request.flow.aer.common.validation;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionValidationResult;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionValidationErrorCodes;
import uk.gov.netz.api.workflow.request.core.validation.RequestTaskActionConflictBasedAbstractValidator;

import java.util.Set;

@Service
public class AerVerificationAlreadyPerformedRequestTaskActionValidator extends RequestTaskActionConflictBasedAbstractValidator {

    @Override
    protected String getErrorCode() {
        return RequestTaskActionValidationErrorCodes.VERIFIED_DATA_FOUND;
    }

    @Override
    public Set<String> getTypes() {
        return Set.of(
            MrtmRequestTaskActionType.AER_REQUEST_VERIFICATION,
            MrtmRequestTaskActionType.AER_REQUEST_AMENDS_VERIFICATION
        );
    }

    @Override
    public Set<String> getConflictingRequestTaskTypes() {
        return Set.of();
    }

    /**
     *  We do not want to  re-send the application to VERIFIER if the verification report is mandatory
     *  but no actual changes have been performed in the application since the first occurrence
     *  of the verification report.
     */
    @Override
    public RequestTaskActionValidationResult validate(final RequestTask requestTask) {
        AerApplicationSubmitRequestTaskPayload aeApplicationSubmitRequestTaskPayload =
            (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        if (Boolean.TRUE.equals(aeApplicationSubmitRequestTaskPayload.getReportingRequired())
            && aeApplicationSubmitRequestTaskPayload.isVerificationPerformed()) {

            return RequestTaskActionValidationResult.invalidResult(this.getErrorCode());
        }

        return RequestTaskActionValidationResult.validResult();
    }
}
