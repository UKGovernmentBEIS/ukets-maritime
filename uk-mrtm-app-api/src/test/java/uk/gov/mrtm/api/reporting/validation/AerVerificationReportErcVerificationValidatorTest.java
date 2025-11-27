package uk.gov.mrtm.api.reporting.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.verification.AerEmissionsReductionClaimVerification;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AerVerificationReportErcVerificationValidatorTest {

    private final AerVerificationReportErcVerificationValidator validator =
        new AerVerificationReportErcVerificationValidator() ;

    @Test
    void validate_valid_when_smf_exists() {
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder()
                .emissionsReductionClaimVerification(AerEmissionsReductionClaimVerification.builder()
                    .smfBatchClaimsReviewed(Boolean.TRUE)
                    .reviewResults("review results")
                    .noDoubleCountingConfirmation("no double counting")
                    .evidenceAllCriteriaMetExist(Boolean.TRUE)
                    .complianceWithEmpRequirementsExist(Boolean.TRUE)
                    .build())
                .build())
            .build();

        Aer aer = Aer.builder().smf(AerSmf.builder().exist(true).build()).build();

        AerValidationResult validationResult = validator.validate(aer, verificationReport);
        assertTrue(validationResult.isValid());
        assertEquals(0, validationResult.getAerViolations().size());
    }

    @Test
    void validate_valid_when_smf_not_exists() {
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder().build())
            .build();

        Aer aer = Aer.builder().smf(AerSmf.builder().exist(false).build()).build();

        AerValidationResult validationResult = validator.validate(aer, verificationReport);
        assertTrue(validationResult.isValid());
        assertEquals(0, validationResult.getAerViolations().size());
    }

    @Test
    void validate_invalid_when_smf_exists() {
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder().build())
            .build();

        Aer aer = Aer.builder().smf(AerSmf.builder().exist(true).build()).build();

        AerValidationResult validationResult = validator.validate(aer, verificationReport);
        assertFalse(validationResult.isValid());
        assertEquals(1, validationResult.getAerViolations().size());
    }
}