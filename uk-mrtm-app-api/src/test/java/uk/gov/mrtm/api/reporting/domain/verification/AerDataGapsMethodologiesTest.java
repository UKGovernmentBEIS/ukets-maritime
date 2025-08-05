package uk.gov.mrtm.api.reporting.domain.verification;

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
class AerDataGapsMethodologiesTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid_when_method_required_false() {
        final AerDataGapsMethodologies dataGapsMethodologies = AerDataGapsMethodologies.builder()
            .methodRequired(Boolean.FALSE)
            .build();

        final Set<ConstraintViolation<AerDataGapsMethodologies>> violations = validator.validate(dataGapsMethodologies);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_invalid_when_method_required_true() {
        final AerDataGapsMethodologies dataGapsMethodologies = AerDataGapsMethodologies.builder()
            .methodRequired(Boolean.TRUE)
            .build();

        final Set<ConstraintViolation<AerDataGapsMethodologies>> violations = validator.validate(dataGapsMethodologies);

        assertThat(violations).isNotEmpty();
        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{aerVerificationData.dataGapsMethodologies.methodRequired.methodApproved}");
    }

    @Test
    void validate_invalid_when_method_required_null() {
        final AerDataGapsMethodologies dataGapsMethodologies = AerDataGapsMethodologies.builder().build();

        final Set<ConstraintViolation<AerDataGapsMethodologies>> violations = validator.validate(dataGapsMethodologies);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("must not be null");
    }

    @Test
    void validate_valid_when_method_approved_true() {
        final AerDataGapsMethodologies dataGapsMethodologies = AerDataGapsMethodologies.builder()
            .methodRequired(Boolean.TRUE)
            .methodApproved(Boolean.TRUE)
            .build();

        final Set<ConstraintViolation<AerDataGapsMethodologies>> violations = validator.validate(dataGapsMethodologies);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_invalid_when_method_approved_false() {
        final AerDataGapsMethodologies dataGapsMethodologies = AerDataGapsMethodologies.builder()
            .methodRequired(Boolean.TRUE)
            .methodApproved(Boolean.FALSE)
            .build();

        final Set<ConstraintViolation<AerDataGapsMethodologies>> violations = validator.validate(dataGapsMethodologies);

        assertThat(violations).isNotEmpty();
        assertEquals(2, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactlyInAnyOrder("{aerVerificationData.dataGapsMethodologies.methodApproved.methodConservative}",
                "{aerVerificationData.dataGapsMethodologies.methodApproved.materialMisstatementExist}");
    }

    @Test
    void validate_valid_when_method_approved_false() {
        final AerDataGapsMethodologies dataGapsMethodologies = AerDataGapsMethodologies.builder()
            .methodRequired(Boolean.TRUE)
            .methodApproved(Boolean.FALSE)
            .methodConservative(Boolean.TRUE)
            .materialMisstatementExist(Boolean.FALSE)
            .build();

        final Set<ConstraintViolation<AerDataGapsMethodologies>> violations = validator.validate(dataGapsMethodologies);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_valid_when_method_conservative_false_and_no_details() {
        final AerDataGapsMethodologies dataGapsMethodologies = AerDataGapsMethodologies.builder()
            .methodRequired(Boolean.TRUE)
            .methodApproved(Boolean.FALSE)
            .methodConservative(Boolean.FALSE)
            .materialMisstatementExist(Boolean.FALSE)
            .build();

        final Set<ConstraintViolation<AerDataGapsMethodologies>> violations = validator.validate(dataGapsMethodologies);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{aerVerificationData.dataGapsMethodologies.methodConservative.details}");
    }

    @Test
    void validate_valid_when_material_misstatement_exist_and_no_details() {
        final AerDataGapsMethodologies dataGapsMethodologies = AerDataGapsMethodologies.builder()
            .methodRequired(Boolean.TRUE)
            .methodApproved(Boolean.FALSE)
            .methodConservative(Boolean.TRUE)
            .materialMisstatementExist(Boolean.TRUE)
            .build();

        final Set<ConstraintViolation<AerDataGapsMethodologies>> violations = validator.validate(dataGapsMethodologies);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{aerVerificationData.dataGapsMethodologies.materialMisstatementExist.details}");
    }

    @Test
    void validate_valid_with_all_steps_completed() {
        final AerDataGapsMethodologies dataGapsMethodologies = AerDataGapsMethodologies.builder()
            .methodRequired(Boolean.TRUE)
            .methodApproved(Boolean.FALSE)
            .methodConservative(Boolean.FALSE)
            .noConservativeMethodDetails("details")
            .materialMisstatementExist(Boolean.TRUE)
            .materialMisstatementDetails("details")
            .build();

        final Set<ConstraintViolation<AerDataGapsMethodologies>> violations = validator.validate(dataGapsMethodologies);

        assertEquals(0, violations.size());
    }
}