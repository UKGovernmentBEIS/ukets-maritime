package uk.gov.mrtm.api.reporting.domain.verification;

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

@ExtendWith(MockitoExtension .class)
class AerOpinionStatementTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void valid() {
        final AerOpinionStatement aerOpinionStatement = AerOpinionStatement.builder()
            .emissionsCorrect(false)
            .manuallyProvidedTotalEmissions(new BigDecimal("3"))
            .manuallyProvidedLessVoyagesInNorthernIrelandDeduction(new BigDecimal("2"))
            .manuallyProvidedSurrenderEmissions(new BigDecimal("1"))
            .additionalChangesNotCovered(false)
            .siteVisit(AerVirtualSiteVisit.builder().type(AerSiteVisitType.VIRTUAL).reason("reason").build())
            .build();

        final Set<ConstraintViolation<AerOpinionStatement>> violations = validator.validate(aerOpinionStatement);

        assertEquals(0, violations.size());
    }

    @Test
    void valid_when_emissions_are_not_correct() {
        final AerOpinionStatement aerOpinionStatement = AerOpinionStatement.builder()
            .emissionsCorrect(true)
            .additionalChangesNotCovered(false)
            .siteVisit(AerVirtualSiteVisit.builder().type(AerSiteVisitType.VIRTUAL).reason("reason").build())
            .build();

        final Set<ConstraintViolation<AerOpinionStatement>> violations = validator.validate(aerOpinionStatement);

        assertEquals(0, violations.size());
    }


    @Test
    void invalid_ni_emissions() {
        final AerOpinionStatement aerOpinionStatement = AerOpinionStatement.builder()
            .emissionsCorrect(false)
            .manuallyProvidedTotalEmissions(new BigDecimal("1"))
            .manuallyProvidedLessVoyagesInNorthernIrelandDeduction(new BigDecimal("2"))
            .manuallyProvidedSurrenderEmissions(new BigDecimal("1"))
            .additionalChangesNotCovered(false)
            .siteVisit(AerVirtualSiteVisit.builder().type(AerSiteVisitType.VIRTUAL).reason("reason").build())
            .build();

        final Set<ConstraintViolation<AerOpinionStatement>> violations = validator.validate(aerOpinionStatement);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{aerVerificationData.opinionStatement.ni.must.be.less.than.total}");
    }

    @Test
    void invalid_surrender_emissions() {
        final AerOpinionStatement aerOpinionStatement = AerOpinionStatement.builder()
            .emissionsCorrect(false)
            .manuallyProvidedTotalEmissions(new BigDecimal("4"))
            .manuallyProvidedLessVoyagesInNorthernIrelandDeduction(new BigDecimal("2"))
            .manuallyProvidedSurrenderEmissions(new BigDecimal("3"))
            .additionalChangesNotCovered(false)
            .siteVisit(AerVirtualSiteVisit.builder().type(AerSiteVisitType.VIRTUAL).reason("reason").build())
            .build();

        final Set<ConstraintViolation<AerOpinionStatement>> violations = validator.validate(aerOpinionStatement);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{aerVerificationData.opinionStatement.surrender.must.be.less.than.ni}");
    }
}