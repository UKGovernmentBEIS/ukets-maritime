package uk.gov.mrtm.api.reporting.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedNonCompliances;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.VERIFICATION_REPORT_INVALID_UNCORRECTED_NON_COMPLIANCES_REFERENCE;

@ExtendWith(MockitoExtension.class)
class AerVerificationReportUncorrectedNonCompliancesValidatorTest {

    private final AerVerificationReportUncorrectedNonCompliancesValidator validator =
        new AerVerificationReportUncorrectedNonCompliancesValidator() ;

    @Test
    void getPrefix() {
        assertEquals("C", validator.getPrefix());
    }

    @Test
    void validate_valid() {
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder()
                .uncorrectedNonCompliances(AerUncorrectedNonCompliances.builder()
                    .exist(Boolean.TRUE)
                    .uncorrectedNonCompliances(Set.of(
                        UncorrectedItem.builder().reference("C1").explanation("Explanation 1").materialEffect(Boolean.TRUE).build(),
                        UncorrectedItem.builder().reference("C201").explanation("Explanation 2").materialEffect(Boolean.FALSE).build()
                    ))
                    .build())
                .build())
            .build();

        AerValidationResult validationResult = validator.validate(verificationReport);
        assertTrue(validationResult.isValid());
        assertEquals(0, validationResult.getAerViolations().size());
    }

    @Test
    void validate_when_no_non_compliances_exist_valid() {
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder()
                .uncorrectedNonCompliances(AerUncorrectedNonCompliances.builder()
                    .exist(Boolean.FALSE)
                    .build())
                .build())
            .build();

        AerValidationResult validationResult = validator.validate(verificationReport);
        assertTrue(validationResult.isValid());
        assertEquals(0, validationResult.getAerViolations().size());
    }

    @Test
    void validate_invalid() {
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder()
                .uncorrectedNonCompliances(AerUncorrectedNonCompliances.builder()
                    .exist(Boolean.TRUE)
                    .uncorrectedNonCompliances(Set.of(
                        UncorrectedItem.builder().reference("D1").explanation("Explanation 1").materialEffect(Boolean.TRUE).build(),
                        UncorrectedItem.builder().reference("D18").explanation("Explanation 2").materialEffect(Boolean.FALSE).build()
                    ))
                    .build())
                .build())
            .build();

        AerValidationResult validationResult = validator.validate(verificationReport);
        assertFalse(validationResult.isValid());
        assertEquals(1, validationResult.getAerViolations().size());
        assertThat(validationResult.getAerViolations()).extracting(AerViolation::getMessage)
            .containsExactly(VERIFICATION_REPORT_INVALID_UNCORRECTED_NON_COMPLIANCES_REFERENCE.getMessage());
    }
}