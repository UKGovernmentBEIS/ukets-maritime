package uk.gov.mrtm.api.workflow.request.flow.aer.common.validation;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionValidationResult;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionValidationErrorCodes;
import uk.gov.netz.api.workflow.request.core.validation.RequestTaskActionConflictBasedAbstractValidator;

import java.util.Set;

@Service
public class AerVerificationNotEligibleRequestTaskActionValidator
        extends RequestTaskActionConflictBasedAbstractValidator {

    @Override
    public String getErrorCode() {
        return RequestTaskActionValidationErrorCodes.VERIFICATION_NOT_ELIGIBLE;
    }

    @Override
    public Set<String> getConflictingRequestTaskTypes() {
        return Set.of();
    }

    @Override
    public RequestTaskActionValidationResult validate(final RequestTask requestTask) {
        AerApplicationRequestTaskPayload aerApplicationSubmitRequestTaskPayload =
                (AerApplicationRequestTaskPayload) requestTask.getPayload();

        return Boolean.FALSE.equals(aerApplicationSubmitRequestTaskPayload.getReportingRequired())
                ? RequestTaskActionValidationResult.invalidResult(this.getErrorCode())
                : RequestTaskActionValidationResult.validResult();
    }

    @Override
    public Set<String> getTypes() {
        return Set.of(
            MrtmRequestTaskActionType.AER_REQUEST_VERIFICATION,
            MrtmRequestTaskActionType.AER_REQUEST_AMENDS_VERIFICATION
        );
    }
}
