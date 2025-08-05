package uk.gov.mrtm.api.reporting.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.verification.AerEtsComplianceRules;
import uk.gov.mrtm.api.reporting.domain.verification.NonConformities;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerEtsComplianceRulesTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {

        final AerEtsComplianceRules etsComplianceRules = AerEtsComplianceRules.builder()
                .monitoringPlanRequirementsMet(Boolean.TRUE)
                .etsOrderRequirementsMet(Boolean.TRUE)
                .detailSourceDataVerified(Boolean.TRUE)
                .partOfSiteVerification("a")
                .controlActivitiesDocumented(Boolean.TRUE)
                .proceduresMonitoringPlanDocumented(Boolean.TRUE)
                .dataVerificationCompleted(Boolean.TRUE)
                .monitoringApproachAppliedCorrectly(Boolean.TRUE)
                .methodsApplyingMissingDataUsed(Boolean.TRUE)
                .competentAuthorityGuidanceMet(Boolean.TRUE)
                .nonConformities(NonConformities.YES)
                .build();
        final Set<ConstraintViolation<AerEtsComplianceRules>> violations = validator.validate(etsComplianceRules);
        assertEquals(0, violations.size());
    }

    @Test
    void validate_valid_reasons_exist() {

        final AerEtsComplianceRules etsComplianceRules = AerEtsComplianceRules.builder()
                .monitoringPlanRequirementsMet(Boolean.FALSE)
                .monitoringPlanRequirementsNotMetReason("a")
                .etsOrderRequirementsMet(Boolean.FALSE)
                .etsOrderRequirementsNotMetReason("a")
                .detailSourceDataVerified(Boolean.FALSE)
                .detailSourceDataNotVerifiedReason("a")
                .controlActivitiesDocumented(Boolean.FALSE)
                .controlActivitiesNotDocumentedReason("a")
                .proceduresMonitoringPlanDocumented(Boolean.FALSE)
                .proceduresMonitoringPlanNotDocumentedReason("a")
                .dataVerificationCompleted(Boolean.FALSE)
                .dataVerificationNotCompletedReason("a")
                .monitoringApproachAppliedCorrectly(Boolean.FALSE)
                .monitoringApproachNotAppliedCorrectlyReason("a")
                .methodsApplyingMissingDataUsed(Boolean.FALSE)
                .methodsApplyingMissingDataNotUsedReason("a")
                .competentAuthorityGuidanceMet(Boolean.FALSE)
                .competentAuthorityGuidanceNotMetReason("a")
                .nonConformities(NonConformities.NO)
                .nonConformitiesDetails("a")
                .build();
        final Set<ConstraintViolation<AerEtsComplianceRules>> violations = validator.validate(etsComplianceRules);
        assertEquals(0, violations.size());
    }

    @Test
    void validate_invalid() {

        final AerEtsComplianceRules etsComplianceRules = AerEtsComplianceRules.builder()
                .monitoringPlanRequirementsMet(Boolean.FALSE)
                .etsOrderRequirementsMet(Boolean.FALSE)
                .detailSourceDataVerified(Boolean.FALSE)
                .controlActivitiesDocumented(Boolean.FALSE)
                .proceduresMonitoringPlanDocumented(Boolean.FALSE)
                .dataVerificationCompleted(Boolean.FALSE)
                .monitoringApproachAppliedCorrectly(Boolean.FALSE)
                .methodsApplyingMissingDataUsed(Boolean.FALSE)
                .competentAuthorityGuidanceMet(Boolean.FALSE)
                .nonConformities(NonConformities.NO)
                .build();
        final Set<ConstraintViolation<AerEtsComplianceRules>> violations = validator.validate(etsComplianceRules);
        assertEquals(10, violations.size());
    }
}
