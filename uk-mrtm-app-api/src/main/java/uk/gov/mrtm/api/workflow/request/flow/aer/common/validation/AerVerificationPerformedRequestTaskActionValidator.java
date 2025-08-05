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
public class AerVerificationPerformedRequestTaskActionValidator extends RequestTaskActionConflictBasedAbstractValidator {

    @Override
    protected String getErrorCode() {
        return RequestTaskActionValidationErrorCodes.NO_VERIFICATION_PERFORMED;
    }

    @Override
    public Set<String> getTypes() {
        return Set.of(
            MrtmRequestTaskActionType.AER_SUBMIT_APPLICATION,
            MrtmRequestTaskActionType.AER_SUBMIT_APPLICATION_AMEND
        );
    }

    @Override
    public Set<String> getConflictingRequestTaskTypes() {
        return Set.of();
    }

    @Override
    public RequestTaskActionValidationResult validate(final RequestTask requestTask) {
        AerApplicationSubmitRequestTaskPayload aerApplicationSubmitRequestTaskPayload =
            (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        if (Boolean.TRUE.equals(aerApplicationSubmitRequestTaskPayload.getReportingRequired())
            && !aerApplicationSubmitRequestTaskPayload.isVerificationPerformed()) {
            return RequestTaskActionValidationResult.invalidResult(this.getErrorCode());
        }

        return RequestTaskActionValidationResult.validResult();
    }
}
