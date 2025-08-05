package uk.gov.mrtm.api.workflow.request.flow.aer.common.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionValidationResult;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionValidationErrorCodes;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class AerVerificationNotEligibleRequestTaskActionValidatorTest {

    @InjectMocks
    private AerVerificationNotEligibleRequestTaskActionValidator validator;

    @Test
    void validate_is_invalid() {
        RequestTask requestTask = RequestTask.builder()
            .payload(AerApplicationRequestTaskPayload.builder()
                .reportingRequired(false)
                .build())
            .build();

        RequestTaskActionValidationResult result = validator.validate(requestTask);

        assertThat(result).isEqualTo(RequestTaskActionValidationResult.invalidResult(
            RequestTaskActionValidationErrorCodes.VERIFICATION_NOT_ELIGIBLE));
    }

    @Test
    void validate_is_valid() {
        RequestTask requestTask = RequestTask.builder()
            .payload(AerApplicationRequestTaskPayload.builder()
                .reportingRequired(true)
                .build())
            .build();

        RequestTaskActionValidationResult result = validator.validate(requestTask);

        assertThat(result).isEqualTo(RequestTaskActionValidationResult.validResult());
    }

    @Test
    void getTypes() {
        assertThat(validator.getTypes()).isEqualTo(Set.of(
            MrtmRequestTaskActionType.AER_REQUEST_VERIFICATION,
            MrtmRequestTaskActionType.AER_REQUEST_AMENDS_VERIFICATION
        ));
    }

    @Test
    void getConflictingRequestTaskTypes() {
        assertThat(validator.getConflictingRequestTaskTypes()).isEqualTo(Set.of());
    }

    @Test
    void getErrorCode() {
        assertThat(validator.getErrorCode())
            .isEqualTo(RequestTaskActionValidationErrorCodes.VERIFICATION_NOT_ELIGIBLE);
    }

}