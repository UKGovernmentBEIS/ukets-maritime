package uk.gov.mrtm.api.reporting.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.common.VerifierComment;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedNonConformities;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.VERIFICATION_REPORT_INVALID_UNCORRECTED_NON_CONFORMITIES_REFERENCE;

@ExtendWith(MockitoExtension.class)
class AerVerificationReportUncorrectedNonConformitiesValidatorTest {

    @InjectMocks
    private AerVerificationReportUncorrectedNonConformitiesValidator validator;

    @Test
    void getPrefix() {
        assertEquals("B", validator.getPrefix());
    }

    @Test
    void validate_valid() {
        AerVerificationReport verificationReport = AerVerificationReport.builder()
                .verificationData(AerVerificationData.builder()
                        .uncorrectedNonConformities(AerUncorrectedNonConformities.builder()
                                .exist(Boolean.TRUE)
                                .uncorrectedNonConformities(Set.of(
                                        UncorrectedItem.builder().reference("B1").explanation("Explanation 1").materialEffect(Boolean.TRUE).build(),
                                        UncorrectedItem.builder().reference("B2").explanation("Explanation 2").materialEffect(Boolean.FALSE).build()
                                ))
                                .existPriorYearIssues(Boolean.FALSE)
                                .build())
                        .build())
                .build();

        AerValidationResult validationResult = validator.validate(verificationReport);
        assertTrue(validationResult.isValid());
        assertEquals(0, validationResult.getAerViolations().size());
    }

    @Test
    void validate_when_no_non_conformities_exist_valid() {
        AerVerificationReport verificationReport = AerVerificationReport.builder()
                .verificationData(AerVerificationData.builder()
                        .uncorrectedNonConformities(AerUncorrectedNonConformities.builder()
                                .exist(Boolean.FALSE)
                                .existPriorYearIssues(Boolean.TRUE)
                                .priorYearIssues(Set.of(VerifierComment.builder().reference("E1").explanation("explanation").build()))
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
                        .uncorrectedNonConformities(AerUncorrectedNonConformities.builder()
                                .exist(Boolean.TRUE)
                                .uncorrectedNonConformities(Set.of(
                                        UncorrectedItem.builder().reference("B1").explanation("Explanation 1").materialEffect(Boolean.TRUE).build(),
                                        UncorrectedItem.builder().reference("D18").explanation("Explanation 182").materialEffect(Boolean.FALSE).build()
                                ))
                                .existPriorYearIssues(Boolean.FALSE)
                                .build())
                        .build())
                .build();

        AerValidationResult validationResult = validator.validate(verificationReport);
        assertFalse(validationResult.isValid());
        assertEquals(1, validationResult.getAerViolations().size());
        assertThat(validationResult.getAerViolations()).extracting(AerViolation::getMessage)
                .containsExactly(VERIFICATION_REPORT_INVALID_UNCORRECTED_NON_CONFORMITIES_REFERENCE.getMessage());
    }
}
