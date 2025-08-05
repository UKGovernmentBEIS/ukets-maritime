package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpVariationDetailsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void when_other_is_not_included_then_is_valid() {
        EmpVariationDetails empVariationDetails = EmpVariationDetails.builder()
            .reason("reason")
            .changes(List.of(EmpVariationChangeType.ADD_NEW_SHIP,
                EmpVariationChangeType.ADD_NEW_FUELS_OR_EMISSION_SOURCES))
            .build();

        Set<ConstraintViolation<EmpVariationDetails>> violations =
            validator.validate(empVariationDetails);

        assertThat(violations.size()).isZero();
    }


    @Test
    void when_other_is_not_included_and_other_reason_is_then_is_invalid() {
        EmpVariationDetails empVariationDetails = EmpVariationDetails.builder()
            .reason("reason")
            .otherSignificantChangeReason("otherSignificantChangeReason")
            .otherNonSignificantChangeReason("otherNonSignificantChangeReason")
            .changes(List.of(EmpVariationChangeType.ADD_NEW_SHIP,
                EmpVariationChangeType.ADD_NEW_FUELS_OR_EMISSION_SOURCES))
            .build();

        Set<ConstraintViolation<EmpVariationDetails>> violations =
            validator.validate(empVariationDetails);

        assertThat(violations.size()).isEqualTo(2);
        Assertions.assertThat(violations).allMatch(violation ->
            "{emp.variation.non.significant.changes.reason}".equals(violation.getMessage())
            || "{emp.variation.significant.changes.reason}".equals(violation.getMessage()));
    }

    @Test
    void when_other_significant_is_included_then_is_valid() {
        EmpVariationDetails empVariationDetails = EmpVariationDetails.builder()
            .reason("reason")
            .changes(List.of(EmpVariationChangeType.OTHER_SIGNIFICANT, EmpVariationChangeType.ADD_NEW_SHIP))
            .otherSignificantChangeReason("test")
            .build();

        Set<ConstraintViolation<EmpVariationDetails>> violations =
            validator.validate(empVariationDetails);

        assertThat(violations.size()).isZero();
    }

    @Test
    void when_other_non_significant_is_included_then_is_valid() {
        EmpVariationDetails empVariationDetails = EmpVariationDetails.builder()
            .reason("reason")
            .changes(List.of(EmpVariationChangeType.OTHER_NON_SIGNIFICANT))
            .otherNonSignificantChangeReason("test")
            .build();

        Set<ConstraintViolation<EmpVariationDetails>> violations =
            validator.validate(empVariationDetails);

        assertThat(violations.size()).isZero();
    }
}