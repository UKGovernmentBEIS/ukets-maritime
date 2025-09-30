package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpEmissionSourcesTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_emission_sources_valid() {
        final EmpEmissionSources empEmissionSources = EmpEmissionSources.builder()
                .listCompletion(createValidEmpProcedureForm())
                .emissionFactors(EmpEmissionFactors.builder()
                        .exist(false)
                        .factors(createValidEmpProcedureForm())
                        .build())
                .emissionCompliance(EmpEmissionCompliance.builder()
                        .exist(true)
                        .criteria(createValidEmpProcedureForm())
                        .build())
                .build();

        final Set<ConstraintViolation<EmpEmissionSources>> violations = validator.validate(empEmissionSources);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_no_list_completion_invalid() {
        final EmpEmissionSources empEmissionSources = EmpEmissionSources.builder()
               .emissionFactors(EmpEmissionFactors.builder()
                        .exist(false)
                        .factors(createValidEmpProcedureForm())
                        .build())
                .emissionCompliance(EmpEmissionCompliance.builder()
                        .exist(true)
                        .criteria(createValidEmpProcedureForm())
                        .build())
                .build();

        final Set<ConstraintViolation<EmpEmissionSources>> violations = validator.validate(empEmissionSources);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_no_emission_factors_invalid() {
        final EmpEmissionSources empEmissionSources = EmpEmissionSources.builder()
                .listCompletion(createValidEmpProcedureForm())
                .emissionCompliance(EmpEmissionCompliance.builder()
                        .exist(true)
                        .criteria(createValidEmpProcedureForm())
                        .build())
                .build();

        final Set<ConstraintViolation<EmpEmissionSources>> violations = validator.validate(empEmissionSources);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_no_emission_compliance_valid() {
        final EmpEmissionSources empEmissionSources = EmpEmissionSources.builder()
                .listCompletion(createValidEmpProcedureForm())
                .emissionFactors(EmpEmissionFactors.builder()
                        .exist(false)
                        .factors(createValidEmpProcedureForm())
                        .build())
                .emissionCompliance(EmpEmissionCompliance.builder()
                    .exist(true)
                    .criteria(createValidEmpProcedureForm())
                    .build())
                .build();

        final Set<ConstraintViolation<EmpEmissionSources>> violations = validator.validate(empEmissionSources);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_exist_true_no_factors_invalid() {
        final EmpEmissionSources empEmissionSources = EmpEmissionSources.builder()
                .listCompletion(createValidEmpProcedureForm())
                .emissionFactors(EmpEmissionFactors.builder()
                        .exist(false)
                        .build())
                .emissionCompliance(EmpEmissionCompliance.builder()
                        .exist(true)
                        .criteria(createValidEmpProcedureForm())
                        .build())
                .build();

        final Set<ConstraintViolation<EmpEmissionSources>> violations = validator.validate(empEmissionSources);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{emp.emission.factors.exist}");
    }

    @Test
    void validate_exist_false_no_factors_valid() {
        final EmpEmissionSources empEmissionSources = EmpEmissionSources.builder()
                .listCompletion(createValidEmpProcedureForm())
                .emissionFactors(EmpEmissionFactors.builder()
                        .exist(true)
                        .build())
                .emissionCompliance(EmpEmissionCompliance.builder()
                        .exist(true)
                        .criteria(createValidEmpProcedureForm())
                        .build())
                .build();

        final Set<ConstraintViolation<EmpEmissionSources>> violations = validator.validate(empEmissionSources);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_exist_true_no_criteria_invalid() {
        final EmpEmissionSources empEmissionSources = EmpEmissionSources.builder()
                .listCompletion(createValidEmpProcedureForm())
                .emissionFactors(EmpEmissionFactors.builder()
                        .exist(false)
                        .factors(createValidEmpProcedureForm())
                        .build())
                .emissionCompliance(EmpEmissionCompliance.builder()
                        .exist(true)
                        .build())
                .build();

        final Set<ConstraintViolation<EmpEmissionSources>> violations = validator.validate(empEmissionSources);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{emp.emission.compliance.exist}");
    }

    @Test
    void validate_exist_false_no_criteria_valid() {
        final EmpEmissionSources empEmissionSources = EmpEmissionSources.builder()
                .listCompletion(createValidEmpProcedureForm())
                .emissionFactors(EmpEmissionFactors.builder()
                        .exist(false)
                        .factors(createValidEmpProcedureForm())
                        .build())
                .emissionCompliance(EmpEmissionCompliance.builder()
                        .exist(false)
                        .build())
                .build();

        final Set<ConstraintViolation<EmpEmissionSources>> violations = validator.validate(empEmissionSources);

        assertEquals(0, violations.size());
    }

    private EmpProcedureForm createValidEmpProcedureForm() {
        return EmpProcedureForm.builder()
                .reference("reference")
                .version("version")
                .description("description")
                .responsiblePersonOrPosition("responsiblePersonOrPosition")
                .recordsLocation("recordsLocation")
                .itSystemUsed("itSystemUsed")
                .build();
    }
}
