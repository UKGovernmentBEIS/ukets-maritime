package uk.gov.mrtm.api.integration.external.emp.domain.shipemissions;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.MethodApproach;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod.BDN;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod.BUNKER_TANK;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod.DIRECT;

@ExtendWith(MockitoExtension.class)
class ExternalEmpUncertaintyLevelTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_emp_uncertainty_level_default_approach_valid() {

        final ExternalEmpUncertaintyLevel uncertaintyLevel = ExternalEmpUncertaintyLevel.builder()
            .monitoringMethodCode(BDN)
            .levelOfUncertaintyTypeCode(MethodApproach.DEFAULT)
            .shipSpecificUncertainty(BigDecimal.valueOf(7.5))
            .build();

        final Set<ConstraintViolation<ExternalEmpUncertaintyLevel>> violations = validator.validate(uncertaintyLevel);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_emp_uncertainty_level_ship_specific_approach_valid() {

        final ExternalEmpUncertaintyLevel uncertaintyLevel = ExternalEmpUncertaintyLevel.builder()
            .monitoringMethodCode(BUNKER_TANK)
            .levelOfUncertaintyTypeCode(MethodApproach.SHIP_SPECIFIC)
            .shipSpecificUncertainty(BigDecimal.valueOf(8.5))
            .build();

        final Set<ConstraintViolation<ExternalEmpUncertaintyLevel>> violations = validator.validate(uncertaintyLevel);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_emp_uncertainty_level_method_d_ship_specific_approach_valid() {

        final ExternalEmpUncertaintyLevel uncertaintyLevel = ExternalEmpUncertaintyLevel.builder()
            .monitoringMethodCode(DIRECT)
            .levelOfUncertaintyTypeCode(MethodApproach.SHIP_SPECIFIC)
            .shipSpecificUncertainty(BigDecimal.valueOf(7.5))
            .build();

        final Set<ConstraintViolation<ExternalEmpUncertaintyLevel>> violations = validator.validate(uncertaintyLevel);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_emp_uncertainty_level_method_d_default_approach_invalid() {

        final ExternalEmpUncertaintyLevel uncertaintyLevel = ExternalEmpUncertaintyLevel.builder()
            .monitoringMethodCode(DIRECT)
            .levelOfUncertaintyTypeCode(MethodApproach.DEFAULT)
            .shipSpecificUncertainty(BigDecimal.valueOf(7.5))
            .build();

        final Set<ConstraintViolation<ExternalEmpUncertaintyLevel>> violations = validator.validate(uncertaintyLevel);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsOnly("{emp.external.emission.uncertaintyLevel.monitoringMethodCode}");
    }

    @Test
    void validate_emp_uncertainty_level_default_approach_invalid() {

        final ExternalEmpUncertaintyLevel uncertaintyLevel = ExternalEmpUncertaintyLevel.builder()
            .monitoringMethodCode(BDN)
            .levelOfUncertaintyTypeCode(MethodApproach.DEFAULT)
            .shipSpecificUncertainty(BigDecimal.valueOf(10.5))
            .build();

        final Set<ConstraintViolation<ExternalEmpUncertaintyLevel>> violations = validator.validate(uncertaintyLevel);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsOnly("{emp.external.emission.uncertaintyLevel.levelOfUncertaintyTypeCode}");
    }

    @ParameterizedTest
    @MethodSource("validScenarios")
    void has_valid_value(BigDecimal value) {
        final ExternalEmpUncertaintyLevel uncertaintyLevel = ExternalEmpUncertaintyLevel.builder()
            .monitoringMethodCode(DIRECT)
            .levelOfUncertaintyTypeCode(MethodApproach.SHIP_SPECIFIC)
            .shipSpecificUncertainty(value)
            .build();

        final Set<ConstraintViolation<ExternalEmpUncertaintyLevel>> violations = validator.validate(uncertaintyLevel);

        assertEquals(0, violations.size());
    }

    public static Stream<BigDecimal> validScenarios() {
        return Stream.of(
            new BigDecimal("1.1"),
            new BigDecimal("11.11"),
            new BigDecimal("11.1"),
            new BigDecimal("11"),
            new BigDecimal("1.11"),
            new BigDecimal("100")
        );
    }

    @ParameterizedTest
    @MethodSource("invalidScenarios")
    void has_invalid_value(BigDecimal value) {
        final ExternalEmpUncertaintyLevel uncertaintyLevel = ExternalEmpUncertaintyLevel.builder()
            .monitoringMethodCode(DIRECT)
            .levelOfUncertaintyTypeCode(MethodApproach.SHIP_SPECIFIC)
            .shipSpecificUncertainty(value)
            .build();

        final Set<ConstraintViolation<ExternalEmpUncertaintyLevel>> violations = validator.validate(uncertaintyLevel);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation ->
            "numeric value out of bounds (<3 digits>.<2 digits> expected)".equals(violation.getMessage())
                || "must be greater than 0".equals(violation.getMessage())
                || "must be less than or equal to 100".equals(violation.getMessage())
                || "must be greater than or equal to 0".equals(violation.getMessage()));
    }

    public static Stream<BigDecimal> invalidScenarios() {
        return Stream.of(
            new BigDecimal("1.111"),
            new BigDecimal("101"),
            new BigDecimal("101"),
            new BigDecimal("101.11"),
            new BigDecimal("0"),
            new BigDecimal("-1")
        );
    }
}
