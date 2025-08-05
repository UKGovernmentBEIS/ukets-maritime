package uk.gov.mrtm.api.reporting.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.common.VerifierComment;
import uk.gov.mrtm.api.reporting.domain.verification.AerRecommendedImprovements;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.VERIFICATION_INVALID_RECOMMENDED_IMPROVEMENT_REFERENCE;

@ExtendWith(MockitoExtension.class)
class AerVerificationReportRecommendedImprovementsValidatorTest {

    @InjectMocks
    private AerVerificationReportRecommendedImprovementsValidator validator;

    @Test
    void validate() {

        final AerVerificationReport aerVerificationReport = AerVerificationReport.builder()
                .verificationData(
                        AerVerificationData.builder()
                                .recommendedImprovements(AerRecommendedImprovements.builder()
                                        .exist(Boolean.TRUE)
                                        .recommendedImprovements(Set.of(
                                                new VerifierComment("D1", "Explanation 1"),
                                                new VerifierComment("D12", "Explanation 2")
                                        ))
                                        .build())
                                .build())
                .build();

        final AerValidationResult aerValidationResult =
                validator.validate(aerVerificationReport);
        assertTrue(aerValidationResult.isValid());
        assertEquals(0, aerValidationResult.getAerViolations().size());
    }

    @Test
    void validate_empty_set_valid() {

        final AerVerificationReport aerVerificationReport = AerVerificationReport.builder()
                .verificationData(
                        AerVerificationData.builder()
                                .recommendedImprovements(AerRecommendedImprovements.builder()
                                        .exist(Boolean.FALSE)
                                        .recommendedImprovements(Set.of())
                                        .build())
                                .build())
                .build();

        final AerValidationResult aerValidationResult =
                validator.validate(aerVerificationReport);
        assertTrue(aerValidationResult.isValid());
        assertEquals(0, aerValidationResult.getAerViolations().size());
    }

    @Test
    void validate_not_valid() {

        final AerVerificationReport aerVerificationReport = AerVerificationReport.builder()
                .verificationData(
                        AerVerificationData.builder()
                                .recommendedImprovements(AerRecommendedImprovements.builder()
                                        .exist(Boolean.TRUE)
                                        .recommendedImprovements(Set.of(
                                                new VerifierComment("A1", "Explanation 1")
                                        ))
                                        .build())
                                .build())
                .build();

        final AerValidationResult validationResult =
                validator.validate(aerVerificationReport);
        assertFalse(validationResult.isValid());
        assertEquals(1, validationResult.getAerViolations().size());
        assertThat(validationResult.getAerViolations()).extracting(AerViolation::getMessage)
                .containsExactly(VERIFICATION_INVALID_RECOMMENDED_IMPROVEMENT_REFERENCE.getMessage());
    }

    @Test
    void getPrefix() {
        assertEquals("D", validator.getPrefix());
    }
}
