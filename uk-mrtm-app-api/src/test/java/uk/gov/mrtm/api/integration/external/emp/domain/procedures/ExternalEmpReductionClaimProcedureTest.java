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

class ExternalEmpReductionClaimProcedureTest {


    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_exists_valid() {
        final ExternalEmpReductionClaimProcedure delegatedResponsibility = ExternalEmpReductionClaimProcedure.builder()
            .emissionsReductionClaimExists(true)
            .reductionClaimProcedureDetails(ExternalEmpProcedureForm.builder()
                .referenceExistingProcedure("reference")
                .versionExistingProcedure("version")
                .description("description")
                .responsiblePerson("responsiblePersonOrPosition")
                .locationOfRecords("recordsLocation")
                .itSystem("itSystemUsed")
                .build())
            .build();
        final Set<ConstraintViolation<ExternalEmpReductionClaimProcedure>> violations = validator.validate(delegatedResponsibility);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_exists_true_invalid() {
        final ExternalEmpReductionClaimProcedure delegatedResponsibility = ExternalEmpReductionClaimProcedure.builder()
            .emissionsReductionClaimExists(true)
            .build();
        final Set<ConstraintViolation<ExternalEmpReductionClaimProcedure>> violations = validator.validate(delegatedResponsibility);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{emp.external.emission.procedures.emissionsReductionClaimExists}");
    }

    @Test
    void validate_exists_false_invalid() {
        final ExternalEmpReductionClaimProcedure delegatedResponsibility = ExternalEmpReductionClaimProcedure.builder()
            .emissionsReductionClaimExists(false)
            .reductionClaimProcedureDetails(ExternalEmpProcedureForm.builder()
                .referenceExistingProcedure("reference")
                .versionExistingProcedure("version")
                .description("description")
                .responsiblePerson("responsiblePersonOrPosition")
                .locationOfRecords("recordsLocation")
                .itSystem("itSystemUsed")
                .build())
            .build();
        final Set<ConstraintViolation<ExternalEmpReductionClaimProcedure>> violations = validator.validate(delegatedResponsibility);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{emp.external.emission.procedures.emissionsReductionClaimExists}");
    }
}