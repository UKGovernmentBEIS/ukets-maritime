package uk.gov.mrtm.api.reporting.domain;

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
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.MethaneSlipValueType;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.enumeration.MeasuringUnit;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class AerFuelConsumptionTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void valid_m3() {
        AerFuelConsumption aerFuelConsumption = AerFuelConsumption.builder()
                .measuringUnit(MeasuringUnit.M3)
                .fuelDensity(new BigDecimal("1"))
                .uniqueIdentifier(UUID.randomUUID())
                .name("test")
                .fuelOriginTypeName(getFuelOriginTypeName(BioFuelType.BIO_LNG, new BigDecimal("1"), null))
                .amount(new BigDecimal("1"))
                .totalConsumption(new BigDecimal("1"))
                .build();

        final Set<ConstraintViolation<AerFuelConsumption>> violations = validator.validate(aerFuelConsumption);

        assertThat(violations).isEmpty();
    }

    @Test
    void valid_tonnes() {
        AerFuelConsumption aerFuelConsumption = AerFuelConsumption.builder()
                .measuringUnit(MeasuringUnit.TONNES)
                .name("test")
                .fuelOriginTypeName(getFuelOriginTypeName(BioFuelType.BIO_LNG, new BigDecimal("1"), null))
                .uniqueIdentifier(UUID.randomUUID())
                .amount(new BigDecimal("1"))
                .totalConsumption(new BigDecimal("1"))
                .build();

        final Set<ConstraintViolation<AerFuelConsumption>> violations = validator.validate(aerFuelConsumption);

        assertThat(violations).isEmpty();
    }

    private FuelOriginBiofuelTypeName getFuelOriginTypeName(BioFuelType bioFuelType, BigDecimal methaneSlip, MethaneSlipValueType methaneSlipValueType) {
        return FuelOriginBiofuelTypeName.builder()
                .origin(FuelOrigin.RFNBO)
                .type(bioFuelType)
                .uniqueIdentifier(UUID.randomUUID())
                .methaneSlipValueType(methaneSlipValueType)
                .methaneSlip(methaneSlip)
                .build();
    }

    @Test
    void invalid() {
        AerFuelConsumption aerFuelConsumption = AerFuelConsumption.builder()
                .measuringUnit(MeasuringUnit.TONNES)
                .fuelDensity(new BigDecimal("1"))
                .name("test")
                .fuelOriginTypeName(getFuelOriginTypeName(BioFuelType.BIO_LNG, new BigDecimal("1"), null))
                .amount(new BigDecimal("1"))
                .totalConsumption(new BigDecimal("1"))
                .uniqueIdentifier(UUID.randomUUID())
                .build();

        final Set<ConstraintViolation<AerFuelConsumption>> violations = validator.validate(aerFuelConsumption);

        assertThat(violations).extracting(ConstraintViolation::getMessage).containsOnly("{aer.fuel.consumption.measuring.unit.invalid}");
    }

    @ParameterizedTest
    @MethodSource("invalidScenarios")
    void invalid_methane_slip_value_type(BigDecimal methaneSlip, BioFuelType bioFuelType, MethaneSlipValueType methaneSlipValueType) {
        AerFuelConsumption aerFuelConsumption = AerFuelConsumption.builder()
                .measuringUnit(MeasuringUnit.TONNES)
                .name("test")
                .fuelOriginTypeName(getFuelOriginTypeName(bioFuelType, methaneSlip, methaneSlipValueType))
                .uniqueIdentifier(UUID.randomUUID())
                .amount(new BigDecimal("1"))
                .totalConsumption(new BigDecimal("1"))
                .build();

        final Set<ConstraintViolation<AerFuelConsumption>> violations = validator.validate(aerFuelConsumption);

        assertThat(violations).extracting(ConstraintViolation::getMessage).containsOnly("{emp.invalid.fuel.details.methane.slip}");
    }

    public static Stream<Arguments> invalidScenarios() {
        return Stream.of(
                Arguments.of(new BigDecimal("1.1"), BioFuelType.BIO_LNG, MethaneSlipValueType.OTHER),
                Arguments.of(null, BioFuelType.BIO_LNG, MethaneSlipValueType.OTHER),
                Arguments.of(null, BioFuelType.BIO_LNG, null),
                Arguments.of(new BigDecimal("1.1"), BioFuelType.OTHER, MethaneSlipValueType.OTHER),
                Arguments.of(null, BioFuelType.OTHER, MethaneSlipValueType.OTHER),
                Arguments.of(null, BioFuelType.OTHER, null),
                Arguments.of(new BigDecimal("1.1"), BioFuelType.BIO_H2, MethaneSlipValueType.OTHER),
                Arguments.of(new BigDecimal("1.1"), BioFuelType.BIO_H2, null),
                Arguments.of(null, BioFuelType.BIO_H2, MethaneSlipValueType.OTHER)
        );
    }

    @ParameterizedTest
    @MethodSource("validScenarios")
    void valid_methane_slip_value_type(BigDecimal methaneSlip, BioFuelType bioFuelType, MethaneSlipValueType methaneSlipValueType) {
        AerFuelConsumption aerFuelConsumption = AerFuelConsumption.builder()
                .measuringUnit(MeasuringUnit.TONNES)
                .name("test")
                .fuelOriginTypeName(getFuelOriginTypeName(bioFuelType, methaneSlip, methaneSlipValueType))
                .uniqueIdentifier(UUID.randomUUID())
                .amount(new BigDecimal("1"))
                .totalConsumption(new BigDecimal("1"))
                .build();

        final Set<ConstraintViolation<AerFuelConsumption>> violations = validator.validate(aerFuelConsumption);

        assertThat(violations).isEmpty();
    }

    public static Stream<Arguments> validScenarios() {
        return Stream.of(
                Arguments.of(new BigDecimal("1.1"), BioFuelType.BIO_LNG, null),
                Arguments.of(new BigDecimal("1.1"), BioFuelType.OTHER, null),
                Arguments.of(null, BioFuelType.BIO_H2, null),
                Arguments.of(null, BioFuelType.ETHANOL, null)
        );
    }
}