package uk.gov.mrtm.api.integration.external.emp.domain.shipemissions;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class ExternalEmpCarbonCaptureTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void when_carbon_capture_are_all_null_then_invalid() {
        final ExternalEmpCarbonCapture empCarbonCapture = ExternalEmpCarbonCapture.builder().build();

        final Set<ConstraintViolation<ExternalEmpCarbonCapture>> violations = validator.validate(empCarbonCapture);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void when_carbon_capture_exist_but_technologies_is_null_then_is_invalid() {
        final ExternalEmpCarbonCapture empCarbonCapture = ExternalEmpCarbonCapture.builder()
            .captureAndStorageApplied(true)
            .build();

        final Set<ConstraintViolation<ExternalEmpCarbonCapture>> violations = validator.validate(empCarbonCapture);

        assertEquals(2, violations.size());
        assertThat(violations).allMatch(violation ->
            "{emp.external.emission.carbon.technology.captureAndStorageApplied}".equals(violation.getMessage()) ||
            "{emp.external.emission.carbon.emissionSourceName.captureAndStorageApplied}".equals(violation.getMessage()));
    }

    @Test
    void when_carbon_capture_not_exist_but_technologies_is_not_null_then_is_invalid() {
        final ExternalEmpCarbonCapture empCarbonCapture = ExternalEmpCarbonCapture.builder().captureAndStorageApplied(false)
            .technology("technology description")
            .emissionSourceName(Set.of("test"))
            .build();

        final Set<ConstraintViolation<ExternalEmpCarbonCapture>> violations = validator.validate(empCarbonCapture);

        assertEquals(2, violations.size());
        assertThat(violations).allMatch(violation ->
            "{emp.external.emission.carbon.technology.captureAndStorageApplied}".equals(violation.getMessage()) ||
                "{emp.external.emission.carbon.emissionSourceName.captureAndStorageApplied}".equals(violation.getMessage()));
    }

    @Test
    void when_carbon_capture_valid() {
        final ExternalEmpCarbonCapture empCarbonCapture = ExternalEmpCarbonCapture.builder()
            .captureAndStorageApplied(true)
            .technology("technology description")
            .emissionSourceName(Set.of("test"))
            .build();

        final Set<ConstraintViolation<ExternalEmpCarbonCapture>> violations = validator.validate(empCarbonCapture);

        assertEquals(0, violations.size());
    }
}