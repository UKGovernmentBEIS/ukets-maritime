package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FlagState;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.IceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ReportingResponsibilityNature;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ShipType;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class ShipDetailsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void when_ship_details_are_all_null_then_invalid() {
        final ShipDetails shipDetails = ShipDetails.builder().build();

        final Set<ConstraintViolation<ShipDetails>> violations = validator.validate(shipDetails);

        assertEquals(7, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage())
                || "must not be blank".equals(violation.getMessage()));
    }

    @ParameterizedTest
    @ValueSource(strings = {"123", "ABC"})
    void when_ship_details_has_invalid_imo_number_then_invalid(String imoNumber) {
        final ShipDetails shipDetails = ShipDetails.builder()
                .imoNumber(imoNumber)
                .name("name")
                .type(ShipType.BULK)
                .grossTonnage(99999)
                .flagState(FlagState.GR)
                .iceClass(IceClass.PC1)
                .natureOfReportingResponsibility(ReportingResponsibilityNature.SHIPOWNER)
                .build();

        final Set<ConstraintViolation<ShipDetails>> violations = validator.validate(shipDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must match \"^\\d{7}$\"".equals(violation.getMessage()));
    }

    @ParameterizedTest
    @ValueSource(ints = {4999, 2147483647, -6000})
    void when_ship_details_has_invalid_gross_tonnage_then_invalid(int grossTonnage) {
        final ShipDetails shipDetails = ShipDetails.builder()
                .imoNumber("1231231")
                .name("name")
                .type(ShipType.BULK)
                .grossTonnage(grossTonnage)
                .flagState(FlagState.GR)
                .iceClass(IceClass.PC1)
                .natureOfReportingResponsibility(ReportingResponsibilityNature.SHIPOWNER)
                .build();

        final Set<ConstraintViolation<ShipDetails>> violations = validator.validate(shipDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation ->
                "must be greater than or equal to 5000".equals(violation.getMessage())
                || "must be less than or equal to 999999999".equals(violation.getMessage()));
    }
}
