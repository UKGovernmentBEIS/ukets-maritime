package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions;

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
class EmpCarbonCaptureTest {
    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void when_carbon_capture_are_all_null_then_invalid() {
        final EmpCarbonCapture empCarbonCapture = EmpCarbonCapture.builder().build();

        final Set<ConstraintViolation<EmpCarbonCapture>> violations = validator.validate(empCarbonCapture);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void when_carbon_capture_exist_but_technologies_is_null_then_is_invalid() {
        final EmpCarbonCapture empCarbonCapture = EmpCarbonCapture.builder().exist(true).build();

        final Set<ConstraintViolation<EmpCarbonCapture>> violations = validator.validate(empCarbonCapture);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation ->
            "{emp.emission.carbon.technologies.exist}".equals(violation.getMessage()));
    }

    @Test
    void when_carbon_capture_not_exist_but_technologies_is_not_null_then_is_invalid() {
        final EmpCarbonCapture empCarbonCapture = EmpCarbonCapture.builder().exist(false)
            .technologies(EmpCarbonCaptureTechnologies.builder()
                .description("description")
                .technologyEmissionSources(Set.of("test"))
                .build()
            )
            .build();

        final Set<ConstraintViolation<EmpCarbonCapture>> violations = validator.validate(empCarbonCapture);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation ->
            "{emp.emission.carbon.technologies.exist}".equals(violation.getMessage()));
    }

    @Test
    void when_carbon_capture_exist_but_technologies_is_invalid_then_is_invalid() {
        final EmpCarbonCapture empCarbonCapture = EmpCarbonCapture.builder()
            .exist(true)
            .technologies(EmpCarbonCaptureTechnologies.builder().build())
            .build();

        final Set<ConstraintViolation<EmpCarbonCapture>> violations = validator.validate(empCarbonCapture);

        assertEquals(2, violations.size());
        assertThat(violations).allMatch(violation -> "must not be empty".equals(violation.getMessage())
            || "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void when_carbon_capture_valid() {
        final EmpCarbonCapture empCarbonCapture = EmpCarbonCapture.builder()
            .exist(true)
            .technologies(EmpCarbonCaptureTechnologies.builder()
                .description("description")
                .technologyEmissionSources(Set.of("test"))
                .build()
            )
            .build();

        final Set<ConstraintViolation<EmpCarbonCapture>> violations = validator.validate(empCarbonCapture);

        assertEquals(0, violations.size());
    }
}