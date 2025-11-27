package uk.gov.mrtm.api.integration.external.aer.domain.reductionclaim;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class ExternalAerReductionClaimTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void valid_when_reductionClaimApplied_is_false() {
        final ExternalAerReductionClaim empCarbonCapture = ExternalAerReductionClaim.builder()
            .reductionClaimApplied(false)
            .build();

        final Set<ConstraintViolation<ExternalAerReductionClaim>> violations = validator.validate(empCarbonCapture);

        assertEquals(0, violations.size());
    }

    @Test
    void valid_when_reductionClaimApplied_is_true() {
        final ExternalAerReductionClaim empCarbonCapture = ExternalAerReductionClaim.builder()
            .reductionClaimApplied(true)
            .reductionClaimDetails(
                ExternalAerReductionClaimDetails.builder()
                    .fuelPurchaseList(List.of(
                        ExternalAerReductionClaimPurchase.builder()
                            .fuelOriginCode(FuelOrigin.FOSSIL)
                            .fuelTypeCode(ExternalFuelType.METHANOL)
                            .batchNumber("1")
                            .fuelMass(new BigDecimal("1"))
                            .ttwEFCarbonDioxide(new BigDecimal("1"))
                            .build()))
                    .build())
            .build();

        final Set<ConstraintViolation<ExternalAerReductionClaim>> violations = validator.validate(empCarbonCapture);

        assertEquals(0, violations.size());
    }

    @Test
    void invalid_when_reductionClaimApplied_is_false() {
        final ExternalAerReductionClaim empCarbonCapture = ExternalAerReductionClaim.builder()
            .reductionClaimApplied(true)
            .build();

        final Set<ConstraintViolation<ExternalAerReductionClaim>> violations = validator.validate(empCarbonCapture);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation ->
            "{aer.external.smf.reductionClaimApplied}".equals(violation.getMessage()));
    }

    @Test
    void invalid_when_reductionClaimApplied_is_true() {
        final ExternalAerReductionClaim empCarbonCapture = ExternalAerReductionClaim.builder()
            .reductionClaimApplied(true)
            .build();

        final Set<ConstraintViolation<ExternalAerReductionClaim>> violations = validator.validate(empCarbonCapture);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation ->
            "{aer.external.smf.reductionClaimApplied}".equals(violation.getMessage()));
    }
}