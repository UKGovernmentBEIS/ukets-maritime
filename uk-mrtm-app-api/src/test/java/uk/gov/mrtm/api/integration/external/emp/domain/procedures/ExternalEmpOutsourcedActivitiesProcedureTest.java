package uk.gov.mrtm.api.integration.external.emp.domain.procedures;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ExternalEmpOutsourcedActivitiesProcedureTest {


    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_exists_valid() {
        final ExternalEmpOutsourcedActivitiesProcedure delegatedResponsibility = ExternalEmpOutsourcedActivitiesProcedure.builder()
            .outsourcedActivitiesExists(true)
            .details(ExternalEmpProcedureForm.builder()
                .referenceExistingProcedure("reference")
                .versionExistingProcedure("version")
                .description("description")
                .responsiblePerson("responsiblePersonOrPosition")
                .locationOfRecords("recordsLocation")
                .itSystem("itSystemUsed")
                .build())
            .build();
        final Set<ConstraintViolation<ExternalEmpOutsourcedActivitiesProcedure>> violations = validator.validate(delegatedResponsibility);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_exists_true_invalid() {
        final ExternalEmpOutsourcedActivitiesProcedure delegatedResponsibility = ExternalEmpOutsourcedActivitiesProcedure.builder()
            .outsourcedActivitiesExists(true)
            .build();
        final Set<ConstraintViolation<ExternalEmpOutsourcedActivitiesProcedure>> violations = validator.validate(delegatedResponsibility);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{emp.external.emission.procedures.outsourcedActivitiesExists}");
    }

    @Test
    void validate_exists_false_invalid() {
        final ExternalEmpOutsourcedActivitiesProcedure delegatedResponsibility = ExternalEmpOutsourcedActivitiesProcedure.builder()
            .outsourcedActivitiesExists(false)
            .details(ExternalEmpProcedureForm.builder()
                .referenceExistingProcedure("reference")
                .versionExistingProcedure("version")
                .description("description")
                .responsiblePerson("responsiblePersonOrPosition")
                .locationOfRecords("recordsLocation")
                .itSystem("itSystemUsed")
                .build())
            .build();
        final Set<ConstraintViolation<ExternalEmpOutsourcedActivitiesProcedure>> violations = validator.validate(delegatedResponsibility);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{emp.external.emission.procedures.outsourcedActivitiesExists}");
    }
}