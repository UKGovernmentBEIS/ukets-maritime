package uk.gov.mrtm.api.integration.external.emp.domain.shipemissions;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;

import java.math.BigDecimal;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class ExternalEmpFuelOriginTypeNameTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @ParameterizedTest
    @EnumSource(value = ExternalFuelType.class, names = {"LNG", "BIO_LNG", "E_LNG", "OTHER"}, mode = EnumSource.Mode.INCLUDE)
    void when_fuel_type_is_lng_and_slip_percentage_is_provided(ExternalFuelType fuelType) {
        final ExternalEmpFuelOriginTypeName empCarbonCapture = ExternalEmpFuelOriginTypeName.builder()
            .fuelTypeCode(fuelType)
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .slipPercentage(new BigDecimal("1"))
            .build();

        final Set<ConstraintViolation<ExternalEmpFuelOriginTypeName>> violations = validator.validate(empCarbonCapture);

        assertEquals(0, violations.size());
    }

    @ParameterizedTest
    @EnumSource(value = ExternalFuelType.class, names = {"LNG", "BIO_LNG", "E_LNG", "OTHER"}, mode = EnumSource.Mode.INCLUDE)
    void when_fuel_type_is_lng_and_slip_percentage_is_not_provided(ExternalFuelType fuelType) {
        final ExternalEmpFuelOriginTypeName empCarbonCapture = ExternalEmpFuelOriginTypeName.builder()
            .fuelTypeCode(fuelType)
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .build();

        final Set<ConstraintViolation<ExternalEmpFuelOriginTypeName>> violations = validator.validate(empCarbonCapture);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{emp.external.invalid.fuel.details.methane.slip}");
    }

    @ParameterizedTest
    @EnumSource(value = ExternalFuelType.class, names = {"LNG", "BIO_LNG", "E_LNG", "OTHER"}, mode = EnumSource.Mode.EXCLUDE)
    void when_fuel_type_is_not_lng_and_slip_percentage_is_not_provided(ExternalFuelType fuelType) {
        final ExternalEmpFuelOriginTypeName empCarbonCapture = ExternalEmpFuelOriginTypeName.builder()
            .fuelTypeCode(fuelType)
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .build();

        final Set<ConstraintViolation<ExternalEmpFuelOriginTypeName>> violations = validator.validate(empCarbonCapture);

        assertEquals(0, violations.size());
    }

    @ParameterizedTest
    @EnumSource(value = ExternalFuelType.class, names = {"LNG", "BIO_LNG", "E_LNG", "OTHER"}, mode = EnumSource.Mode.EXCLUDE)
    void when_fuel_type_is_not_lng_and_slip_percentage_is_provided(ExternalFuelType fuelType) {
        final ExternalEmpFuelOriginTypeName empCarbonCapture = ExternalEmpFuelOriginTypeName.builder()
            .fuelTypeCode(fuelType)
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .slipPercentage(new BigDecimal("1"))
            .build();

        final Set<ConstraintViolation<ExternalEmpFuelOriginTypeName>> violations = validator.validate(empCarbonCapture);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{emp.external.invalid.fuel.details.methane.slip}");
    }
}