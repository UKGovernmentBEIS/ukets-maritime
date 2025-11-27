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
class ExternalEmpExemptionConditionsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_exemption_conditions_exist_valid() {

        final ExternalEmpExemptionConditions exemptionConditions = ExternalEmpExemptionConditions.builder()
            .derogationCodeUsed(Boolean.TRUE)
            .minimumNumberOfVoyages(301)
            .build();

        final Set<ConstraintViolation<ExternalEmpExemptionConditions>> violations = validator.validate(exemptionConditions);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_exemption_conditions_not_exist_valid() {

        final ExternalEmpExemptionConditions exemptionConditions = ExternalEmpExemptionConditions.builder()
            .derogationCodeUsed(Boolean.FALSE)
            .build();

        final Set<ConstraintViolation<ExternalEmpExemptionConditions>> violations = validator.validate(exemptionConditions);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_exemption_conditions_not_exist_invalid() {

        final ExternalEmpExemptionConditions exemptionConditions = ExternalEmpExemptionConditions.builder()
            .derogationCodeUsed(Boolean.FALSE)
            .minimumNumberOfVoyages(350)
            .build();

        final Set<ConstraintViolation<ExternalEmpExemptionConditions>> violations = validator.validate(exemptionConditions);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsOnly("{emp.external.emission.exemptionconditions.derogationCodeUsed}");
    }

    @Test
    void validate_exemption_conditions_exist_invalid() {

        final ExternalEmpExemptionConditions exemptionConditions = ExternalEmpExemptionConditions.builder()
            .derogationCodeUsed(Boolean.TRUE)
            .build();

        final Set<ConstraintViolation<ExternalEmpExemptionConditions>> violations = validator.validate(exemptionConditions);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsOnly("{emp.external.emission.exemptionconditions.derogationCodeUsed}");
    }

    @Test
    void validate_exemption_conditions_exist_low_voyages_number_invalid() {

        final ExternalEmpExemptionConditions exemptionConditions = ExternalEmpExemptionConditions.builder()
            .derogationCodeUsed(Boolean.TRUE)
            .minimumNumberOfVoyages(250)
            .build();

        final Set<ConstraintViolation<ExternalEmpExemptionConditions>> violations = validator.validate(exemptionConditions);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsOnly("must be greater than or equal to 301");
    }
}
