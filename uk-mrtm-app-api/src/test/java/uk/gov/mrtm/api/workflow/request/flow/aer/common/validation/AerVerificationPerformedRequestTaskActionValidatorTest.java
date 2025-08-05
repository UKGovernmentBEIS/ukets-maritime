package uk.gov.mrtm.api.workflow.request.flow.aer.common.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionValidationResult;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionValidationErrorCodes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
class AerVerificationPerformedRequestTaskActionValidatorTest {

    @InjectMocks
    private AerVerificationPerformedRequestTaskActionValidator validator;

    @Test
    void getErrorMessage() {
        assertEquals(RequestTaskActionValidationErrorCodes.NO_VERIFICATION_PERFORMED, validator.getErrorCode());
    }

    @Test
    void getTypes() {
        assertThat(validator.getTypes()).containsExactlyInAnyOrder(
            MrtmRequestTaskActionType.AER_SUBMIT_APPLICATION,
            MrtmRequestTaskActionType.AER_SUBMIT_APPLICATION_AMEND
        );
    }

    @Test
    void getConflictingRequestTaskTypes() {
        assertThat(validator.getConflictingRequestTaskTypes()).isEmpty();
    }

    @Test
    void validate_valid() {
        AerApplicationSubmitRequestTaskPayload requestTaskPayload =
            AerApplicationSubmitRequestTaskPayload.builder()
                .reportingRequired(true)
                .verificationPerformed(true)
                .build();
        RequestTask requestTask = RequestTask.builder().payload(requestTaskPayload).build();

        RequestTaskActionValidationResult validationResult = validator.validate(requestTask);
        assertTrue(validationResult.isValid());
    }

    @Test
    void validate_valid_when_no_reporting_required_and_verificationPerformed_false() {
        AerApplicationSubmitRequestTaskPayload requestTaskPayload =
            AerApplicationSubmitRequestTaskPayload.builder()
                .reportingRequired(false)
                .verificationPerformed(false)
                .build();
        RequestTask requestTask = RequestTask.builder().payload(requestTaskPayload).build();

        RequestTaskActionValidationResult validationResult = validator.validate(requestTask);
        assertTrue(validationResult.isValid());
    }

    @Test
    void validate_invalid_scenario_when_reporting_required_and_verificationPerformed_false() {
        AerApplicationSubmitRequestTaskPayload requestTaskPayload =
            AerApplicationSubmitRequestTaskPayload.builder()
                .reportingRequired(true)
                .verificationPerformed(false)
                .build();
        RequestTask requestTask = RequestTask.builder().payload(requestTaskPayload).build();

        RequestTaskActionValidationResult validationResult = validator.validate(requestTask);
        assertFalse(validationResult.isValid());
    }
}