package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel;

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
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodBunker;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodTank;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.EmpBioFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.EmpEFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.EmpFossilFuels;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpFuelsAndEmissionsFactorsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @ParameterizedTest
    @MethodSource("validFossilFuelScenarios")
    void validate_emp_fossil_fuels_and_emission_factors_valid(FossilFuelType type,
                                                              String name,
                                                              BigDecimal carbonDioxide,
                                                              BigDecimal methane,
                                                              BigDecimal nitrousOxide,
                                                              BigDecimal sustainableFraction) {

        final EmpFuelsAndEmissionsFactors empShipDetails = EmpFossilFuels.builder()
            .type(type)
            .origin(FuelOrigin.FOSSIL)
            .name(name)
            .carbonDioxide(carbonDioxide)
            .methane(methane)
            .uniqueIdentifier(UUID.randomUUID())
            .nitrousOxide(nitrousOxide)
            .sustainableFraction(sustainableFraction)
            .densityMethodBunker(DensityMethodBunker.FUEL_SUPPLIER)
            .densityMethodTank(DensityMethodTank.MEASUREMENT_SYSTEMS)
            .build();

        final Set<ConstraintViolation<EmpFuelsAndEmissionsFactors>> violations = validator.validate(empShipDetails);

        assertEquals(0, violations.size());
    }

    private static Stream<Arguments> validFossilFuelScenarios() {

        return Stream.of(
            Arguments.of(FossilFuelType.HFO, null, new BigDecimal("3.114"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(FossilFuelType.LFO, null, new BigDecimal("3.151"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(FossilFuelType.MDO, null, new BigDecimal("3.206"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(FossilFuelType.MGO, null, new BigDecimal("3.206"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(FossilFuelType.LNG, null, new BigDecimal("2.75"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(FossilFuelType.LPG_BUTANE, null, new BigDecimal("3.03"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(FossilFuelType.LPG_PROPANE, null, new BigDecimal("3"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(FossilFuelType.H2, null, new BigDecimal("0"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(FossilFuelType.NH3, null, new BigDecimal("0"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(FossilFuelType.METHANOL, null, new BigDecimal("1.375"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0")),
            Arguments.of(FossilFuelType.OTHER, "name", new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"))
        );
    }

    @ParameterizedTest
    @MethodSource("validEFuelScenarios")
    void validate_emp_e_fuels_and_emission_factors_valid(EFuelType type,
                                                         String name,
                                                         BigDecimal carbonDioxide,
                                                         BigDecimal methane,
                                                         BigDecimal nitrousOxide,
                                                         BigDecimal sustainableFraction) {

        final EmpFuelsAndEmissionsFactors empShipDetails = EmpEFuels.builder()
            .type(type)
            .origin(FuelOrigin.RFNBO)
            .name(name)
            .uniqueIdentifier(UUID.randomUUID())
            .carbonDioxide(carbonDioxide)
            .methane(methane)
            .nitrousOxide(nitrousOxide)
            .densityMethodBunker(DensityMethodBunker.FUEL_SUPPLIER)
            .densityMethodTank(DensityMethodTank.MEASUREMENT_SYSTEMS)
            .sustainableFraction(sustainableFraction)
            .build();

        final Set<ConstraintViolation<EmpFuelsAndEmissionsFactors>> violations = validator.validate(empShipDetails);

        assertEquals(0, violations.size());
    }

    private static Stream<Arguments> validEFuelScenarios() {

        return Stream.of(
            Arguments.of(EFuelType.E_DIESEL, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0"), new BigDecimal("1")),
            Arguments.of(EFuelType.E_METHANOL, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0"), new BigDecimal("1")),
            Arguments.of(EFuelType.E_LNG, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(EFuelType.E_H2, null, new BigDecimal("0"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0"), new BigDecimal("1")),
            Arguments.of(EFuelType.E_NH3, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(EFuelType.E_LPG, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(EFuelType.E_DME, null, new BigDecimal("0"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0"), new BigDecimal("1")),
            Arguments.of(EFuelType.OTHER, "name", new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"))
        );
    }

    @ParameterizedTest
    @MethodSource("validBioFuelScenarios")
    void validate_emp_bio_fuels_and_emission_factors_valid(BioFuelType type,
                                                           String name,
                                                           BigDecimal carbonDioxide,
                                                           BigDecimal methane,
                                                           BigDecimal nitrousOxide,
                                                           BigDecimal sustainableFraction) {

        final EmpFuelsAndEmissionsFactors empShipDetails = EmpBioFuels.builder()
            .type(type)
            .origin(FuelOrigin.BIOFUEL)
            .name(name)
            .carbonDioxide(carbonDioxide)
            .uniqueIdentifier(UUID.randomUUID())
            .methane(methane)
            .nitrousOxide(nitrousOxide)
            .densityMethodBunker(DensityMethodBunker.FUEL_SUPPLIER)
            .densityMethodTank(DensityMethodTank.MEASUREMENT_SYSTEMS)
            .sustainableFraction(sustainableFraction)

            .build();

        final Set<ConstraintViolation<EmpFuelsAndEmissionsFactors>> violations = validator.validate(empShipDetails);

        assertEquals(0, violations.size());
    }

    private static Stream<Arguments> validBioFuelScenarios() {

        return Stream.of(
            Arguments.of(BioFuelType.ETHANOL, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0"), new BigDecimal("1")),
            Arguments.of(BioFuelType.BIO_DIESEL, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0"), new BigDecimal("1")),
            Arguments.of(BioFuelType.HVO, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0"), new BigDecimal("1")),
            Arguments.of(BioFuelType.BIO_LNG, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(BioFuelType.BIO_METHANOL, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0"), new BigDecimal("1")),
            Arguments.of(BioFuelType.BIO_H2, null, new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("0"), new BigDecimal("1")),
            Arguments.of(BioFuelType.OTHER, "name", new BigDecimal("1"),
                new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"), new BigDecimal("1"))
        );
    }

    @ParameterizedTest
    @MethodSource("invalidBigDecimal")
    void validate_emp_number_out_of_range_invalid(BigDecimal value1, BigDecimal value2) {

        final EmpFuelsAndEmissionsFactors empShipDetails = EmpBioFuels.builder()
            .type(BioFuelType.OTHER)
            .origin(FuelOrigin.BIOFUEL)
            .name("name")
            .uniqueIdentifier(UUID.randomUUID())
            .carbonDioxide(value1)
            .methane(value1)
            .nitrousOxide(value1)
            .sustainableFraction(value2)
            .densityMethodBunker(DensityMethodBunker.FUEL_SUPPLIER)
            .densityMethodTank(DensityMethodTank.MEASUREMENT_SYSTEMS)
            .build();

        final Set<ConstraintViolation<EmpFuelsAndEmissionsFactors>> violations = validator.validate(empShipDetails);

        assertEquals(4, violations.size());
        assertThat(violations).allMatch(violation ->
            "numeric value out of bounds (<12 digits>.<2147483647 digits> expected)".equals(violation.getMessage())
            || "numeric value out of bounds (<3 digits>.<2 digits> expected)".equals(violation.getMessage())
            || "must be less than or equal to 100".equals(violation.getMessage())
            || "must be greater than or equal to 0".equals(violation.getMessage())
            || "Invalid value".equals(violation.getMessage()));

    }

    private static Stream<Arguments> invalidBigDecimal() {
        return Stream.of(
            Arguments.of(new BigDecimal("1234567890123"), new BigDecimal("10.001")),
            Arguments.of(new BigDecimal("-1"), new BigDecimal("100.1")),
            Arguments.of(new BigDecimal("-123456789"), new BigDecimal("-10")),
            Arguments.of(new BigDecimal("1234567890123"), new BigDecimal("1.111"))
        );
    }

    @Test
    void validate_emp_null_values_invalid() {

        final EmpFuelsAndEmissionsFactors empShipDetails = EmpBioFuels.builder().build();

        final Set<ConstraintViolation<EmpFuelsAndEmissionsFactors>> violations = validator.validate(empShipDetails);

        assertEquals(8, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage())
            || "{emp.invalid.bio.fuel.emissions}".equals(violation.getMessage()));
    }
}
