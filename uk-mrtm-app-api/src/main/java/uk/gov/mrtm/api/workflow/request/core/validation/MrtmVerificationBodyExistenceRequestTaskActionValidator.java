package uk.gov.mrtm.api.workflow.request.core.validation;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionValidationErrorCodes;
import uk.gov.netz.api.workflow.request.core.validation.VerificationBodyExistenceRequestTaskActionValidator;

import java.util.Set;

@Service
public class MrtmVerificationBodyExistenceRequestTaskActionValidator extends
    VerificationBodyExistenceRequestTaskActionValidator {

    @Override
    protected String getErrorCode() {
        return RequestTaskActionValidationErrorCodes.NO_VB_FOUND;
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
}
