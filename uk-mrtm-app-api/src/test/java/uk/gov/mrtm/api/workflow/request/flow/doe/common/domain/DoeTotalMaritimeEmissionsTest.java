package uk.gov.mrtm.api.workflow.request.flow.doe.common.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class DoeTotalMaritimeEmissionsTest {
    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void valid() {
        final DoeTotalMaritimeEmissions emissions = DoeTotalMaritimeEmissions.builder()
            .determinationType(DoeDeterminationType.MARITIME_EMISSIONS)
            .totalReportableEmissions(new BigDecimal("3"))
            .lessVoyagesInNorthernIrelandDeduction(new BigDecimal("2"))
            .surrenderEmissions(new BigDecimal("1"))
            .calculationApproach("calculationApproach")
            .build();

        final Set<ConstraintViolation<DoeTotalMaritimeEmissions>> violations = validator.validate(emissions);

        assertEquals(0, violations.size());
    }

    @Test
    void valid_when_all_are_equal() {
        final DoeTotalMaritimeEmissions emissions = DoeTotalMaritimeEmissions.builder()
            .determinationType(DoeDeterminationType.MARITIME_EMISSIONS)
            .totalReportableEmissions(new BigDecimal("1"))
            .lessVoyagesInNorthernIrelandDeduction(new BigDecimal("1"))
            .surrenderEmissions(new BigDecimal("1"))
            .calculationApproach("calculationApproach")
            .build();

        final Set<ConstraintViolation<DoeTotalMaritimeEmissions>> violations = validator.validate(emissions);

        assertEquals(0, violations.size());
    }

    @Test
    void invalid_ni_emissions() {
        final DoeTotalMaritimeEmissions emissions = DoeTotalMaritimeEmissions.builder()
            .determinationType(DoeDeterminationType.MARITIME_EMISSIONS)
            .totalReportableEmissions(new BigDecimal("1"))
            .lessVoyagesInNorthernIrelandDeduction(new BigDecimal("2"))
            .surrenderEmissions(new BigDecimal("1"))
            .calculationApproach("calculationApproach")
            .build();

        final Set<ConstraintViolation<DoeTotalMaritimeEmissions>> violations = validator.validate(emissions);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{doe.emissions.ni.must.be.less.than.total}");
    }

    @Test
    void invalid_surrender_emissions() {
        final DoeTotalMaritimeEmissions emissions = DoeTotalMaritimeEmissions.builder()
            .determinationType(DoeDeterminationType.MARITIME_EMISSIONS)
            .totalReportableEmissions(new BigDecimal("4"))
            .lessVoyagesInNorthernIrelandDeduction(new BigDecimal("2"))
            .surrenderEmissions(new BigDecimal("3"))
            .calculationApproach("calculationApproach")
            .build();

        final Set<ConstraintViolation<DoeTotalMaritimeEmissions>> violations = validator.validate(emissions);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{doe.emissions.surrender.must.be.less.than.ni}");
    }
}