package uk.gov.mrtm.api.integration.external.aer.domain.shipemissions;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class ExternalAerFuelsAndEmissionsFactorsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void when_fuel_origin_is_fossil() {
        final ExternalAerFuelsAndEmissionsFactors empCarbonCapture = ExternalAerFuelsAndEmissionsFactors.builder()
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .fuelTypeCode(ExternalFuelType.ETHANOL)
            .ttwEFCarbonDioxide(new BigDecimal("3.114"))
            .ttwEFMethane(new BigDecimal("1"))
            .ttwEFNitrousOxide(new BigDecimal("1"))
            .build();

        final Set<ConstraintViolation<ExternalAerFuelsAndEmissionsFactors>> violations = validator.validate(empCarbonCapture);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation ->
            "{emp.external.fuelTypeCode.origin.constraint}".equals(violation.getMessage()));
    }

    @ParameterizedTest
    @MethodSource("validFossilFuelScenarios")
    void validate_emp_fossil_fuels_and_emission_factors_valid(ExternalFuelType type,
                                                              String name,
                                                              BigDecimal ttwEFCarbonDioxide,
                                                              BigDecimal methane,
                                                              BigDecimal nitrousOxide) {

        final ExternalAerFuelsAndEmissionsFactors emissionsFactors = ExternalAerFuelsAndEmissionsFactors.builder()
            .fuelTypeCode(type)
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .otherFuelType(name)
            .ttwEFCarbonDioxide(ttwEFCarbonDioxide)
            .ttwEFMethane(methane)
            .ttwEFNitrousOxide(nitrousOxide)
            .build();

        final Set<ConstraintViolation<ExternalAerFuelsAndEmissionsFactors>> violations = validator.validate(emissionsFactors);

        assertEquals(0, violations.size());
    }

    private static Stream<Arguments> validFossilFuelScenarios() {

        return Stream.of(
            Arguments.of(ExternalFuelType.HFO, null, new BigDecimal("3.114"),
                new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.LFO, null, new BigDecimal("3.151"),
                new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.MDO, null, new BigDecimal("3.206"),
                new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.MGO, null, new BigDecimal("3.206"),
                new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.LNG, null, new BigDecimal("2.75"),
                new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.LPG_BUTANE, null, new BigDecimal("3.03"),
                new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.LPG_PROPANE, null, new BigDecimal("3"),
                new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.H2, null, new BigDecimal("0"),
                new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.NH3, null, new BigDecimal("0"),
                new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.METHANOL, null, new BigDecimal("1.375"),
                new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.OTHER, "name", new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"))
        );
    }

    @ParameterizedTest
    @MethodSource("validEFuelScenarios")
    void validate_emp_e_fuels_and_emission_factors_valid(ExternalFuelType type,
                                                         String name,
                                                         BigDecimal ttwEFCarbonDioxide,
                                                         BigDecimal methane,
                                                         BigDecimal nitrousOxide) {

        final ExternalAerFuelsAndEmissionsFactors empShipDetails = ExternalAerFuelsAndEmissionsFactors.builder()
            .fuelTypeCode(type)
            .fuelOriginCode(FuelOrigin.RFNBO)
            .otherFuelType(name)
            .ttwEFCarbonDioxide(ttwEFCarbonDioxide)
            .ttwEFMethane(methane)
            .ttwEFNitrousOxide(nitrousOxide)
            .build();

        final Set<ConstraintViolation<ExternalAerFuelsAndEmissionsFactors>> violations = validator.validate(empShipDetails);

        assertEquals(0, violations.size());
    }

    private static Stream<Arguments> validEFuelScenarios() {

        return Stream.of(
            Arguments.of(ExternalFuelType.E_DIESEL, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(ExternalFuelType.E_METHANOL, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(ExternalFuelType.E_LNG, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.E_H2, null, new BigDecimal("0"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(ExternalFuelType.E_NH3, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.E_LPG, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.E_DME, null, new BigDecimal("0"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(ExternalFuelType.OTHER, "name", new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"))
        );
    }

    @ParameterizedTest
    @MethodSource("validBioFuelScenarios")
    void validate_emp_bio_fuels_and_emission_factors_valid(ExternalFuelType type,
                                                           String name,
                                                           BigDecimal ttwEFCarbonDioxide,
                                                           BigDecimal methane,
                                                           BigDecimal nitrousOxide) {

        final ExternalAerFuelsAndEmissionsFactors empShipDetails = ExternalAerFuelsAndEmissionsFactors.builder()
            .fuelTypeCode(type)
            .fuelOriginCode(FuelOrigin.BIOFUEL)
            .otherFuelType(name)
            .ttwEFCarbonDioxide(ttwEFCarbonDioxide)
            .ttwEFMethane(methane)
            .ttwEFNitrousOxide(nitrousOxide)
            .build();

        final Set<ConstraintViolation<ExternalAerFuelsAndEmissionsFactors>> violations = validator.validate(empShipDetails);

        assertEquals(0, violations.size());
    }

    private static Stream<Arguments> validBioFuelScenarios() {

        return Stream.of(
            Arguments.of(ExternalFuelType.ETHANOL, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(ExternalFuelType.BIO_DIESEL, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(ExternalFuelType.HVO, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(ExternalFuelType.BIO_LNG, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(ExternalFuelType.BIO_METHANOL, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(ExternalFuelType.BIO_H2, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(ExternalFuelType.OTHER, "name", new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"))
        );
    }

    @ParameterizedTest
    @MethodSource("invalidBigDecimal")
    void validate_emp_number_out_of_range_invalid(BigDecimal value) {

        final ExternalAerFuelsAndEmissionsFactors empShipDetails = ExternalAerFuelsAndEmissionsFactors.builder()
            .fuelTypeCode(ExternalFuelType.OTHER)
            .fuelOriginCode(FuelOrigin.BIOFUEL)
            .otherFuelType("name")
            .ttwEFCarbonDioxide(value)
            .ttwEFMethane(value)
            .ttwEFNitrousOxide(value)
            .build();

        final Set<ConstraintViolation<ExternalAerFuelsAndEmissionsFactors>> violations = validator.validate(empShipDetails);

        assertEquals(3, violations.size());
        assertThat(violations).allMatch(violation ->
            "numeric value out of bounds (<12 digits>.<2147483647 digits> expected)".equals(violation.getMessage())
                || "numeric value out of bounds (<3 digits>.<2 digits> expected)".equals(violation.getMessage())
                || "must be less than or equal to 100".equals(violation.getMessage())
                || "must be greater than or equal to 0".equals(violation.getMessage())
                || "Invalid value".equals(violation.getMessage()));

    }

    private static Stream<Arguments> invalidBigDecimal() {
        return Stream.of(
            Arguments.of(new BigDecimal("1234567890123")),
            Arguments.of(new BigDecimal("-1")),
            Arguments.of(new BigDecimal("-123456789")),
            Arguments.of(new BigDecimal("1234567890123"))
        );
    }
}
