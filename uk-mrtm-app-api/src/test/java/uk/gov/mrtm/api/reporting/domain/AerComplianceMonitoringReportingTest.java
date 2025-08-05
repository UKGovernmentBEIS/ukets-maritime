package uk.gov.mrtm.api.reporting.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.verification.AerComplianceMonitoringReporting;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerComplianceMonitoringReportingTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {

        final AerComplianceMonitoringReporting complianceMonitoringReporting = AerComplianceMonitoringReporting.builder()
                .accuracyCompliant(Boolean.TRUE)
                .completenessCompliant(Boolean.TRUE)
                .consistencyCompliant(Boolean.TRUE)
                .comparabilityCompliant(Boolean.TRUE)
                .transparencyCompliant(Boolean.TRUE)
                .integrityCompliant(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<AerComplianceMonitoringReporting>> violations = validator.validate(complianceMonitoringReporting);
        assertEquals(0, violations.size());
    }

    @Test
    void validate_valid_reasons_exist() {

        final AerComplianceMonitoringReporting complianceMonitoringReporting = AerComplianceMonitoringReporting.builder()
                .accuracyCompliant(Boolean.FALSE)
                .accuracyNonCompliantReason("a")
                .completenessCompliant(Boolean.FALSE)
                .completenessNonCompliantReason("a")
                .consistencyCompliant(Boolean.FALSE)
                .consistencyNonCompliantReason("a")
                .comparabilityCompliant(Boolean.FALSE)
                .comparabilityNonCompliantReason("a")
                .transparencyCompliant(Boolean.FALSE)
                .transparencyNonCompliantReason("a")
                .integrityCompliant(Boolean.FALSE)
                .integrityNonCompliantReason("a")
                .build();

        final Set<ConstraintViolation<AerComplianceMonitoringReporting>> violations = validator.validate(complianceMonitoringReporting);
        assertEquals(0, violations.size());
    }

    @Test
    void validate_valid_invalid() {

        final AerComplianceMonitoringReporting complianceMonitoringReporting = AerComplianceMonitoringReporting.builder()
                .accuracyCompliant(Boolean.TRUE)
                .accuracyNonCompliantReason("a")
                .completenessCompliant(Boolean.TRUE)
                .completenessNonCompliantReason("a")
                .consistencyCompliant(Boolean.TRUE)
                .consistencyNonCompliantReason("a")
                .comparabilityCompliant(Boolean.TRUE)
                .comparabilityNonCompliantReason("a")
                .transparencyCompliant(Boolean.TRUE)
                .transparencyNonCompliantReason("a")
                .integrityCompliant(Boolean.TRUE)
                .integrityNonCompliantReason("a")
                .build();

        final Set<ConstraintViolation<AerComplianceMonitoringReporting>> violations = validator.validate(complianceMonitoringReporting);
        assertEquals(6, violations.size());
    }
}
