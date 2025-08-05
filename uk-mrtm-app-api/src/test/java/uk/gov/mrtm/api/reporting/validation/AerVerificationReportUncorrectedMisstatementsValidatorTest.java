package uk.gov.mrtm.api.reporting.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedMisstatements;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.VERIFICATION_REPORT_INVALID_UNCORRECTED_MISSTATEMENT_REFERENCE;

@ExtendWith(MockitoExtension.class)
class AerVerificationReportUncorrectedMisstatementsValidatorTest {

    private final AerVerificationReportUncorrectedMisstatementsValidator validator =
        new AerVerificationReportUncorrectedMisstatementsValidator() ;

    @Test
    void getPrefix() {
        assertEquals("A", validator.getPrefix());
    }

    @Test
    void validate_valid() {
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder()
                .uncorrectedMisstatements(AerUncorrectedMisstatements.builder()
                    .exist(Boolean.TRUE)
                    .uncorrectedMisstatements(Set.of(
                        UncorrectedItem.builder().reference("A1").explanation("Explanation 1").materialEffect(Boolean.TRUE).build(),
                        UncorrectedItem.builder().reference("A1001").explanation("Explanation 2").materialEffect(Boolean.FALSE).build()
                    ))
                    .build())
                .build())
            .build();

        AerValidationResult validationResult = validator.validate(verificationReport);
        assertTrue(validationResult.isValid());
        assertEquals(0, validationResult.getAerViolations().size());
    }

    @Test
    void validate_when_no_misstaments_exist_valid() {
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder()
                .uncorrectedMisstatements(AerUncorrectedMisstatements.builder()
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
                .uncorrectedMisstatements(AerUncorrectedMisstatements.builder()
                    .exist(Boolean.TRUE)
                    .uncorrectedMisstatements(Set.of(
                        UncorrectedItem.builder().reference("A1").explanation("Explanation 1").materialEffect(Boolean.TRUE).build(),
                        UncorrectedItem.builder().reference("Z100").explanation("Explanation 2").materialEffect(Boolean.FALSE).build()
                    ))
                    .build())
                .build())
            .build();

        AerValidationResult validationResult = validator.validate(verificationReport);
        assertFalse(validationResult.isValid());
        assertEquals(1, validationResult.getAerViolations().size());
        assertThat(validationResult.getAerViolations()).extracting(AerViolation::getMessage)
            .containsExactly(VERIFICATION_REPORT_INVALID_UNCORRECTED_MISSTATEMENT_REFERENCE.getMessage());
    }
}