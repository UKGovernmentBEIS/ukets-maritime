package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.biofuel.AerBioFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.efuel.AerEFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil.AerFossilFuels;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortEmissions;
import uk.gov.mrtm.api.reporting.enumeration.MeasuringUnit;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerPortEmissionsCalculatorTest {
    private static final String IMO_NUMBER = "1234567";

    @InjectMocks
    private AerPortEmissionsCalculator validator;

    @ParameterizedTest
    @MethodSource("validScenarios")
    void calculate_Emissions(MeasuringUnit measuringUnit,
                             BigDecimal totalConsumption,
                             FuelOriginTypeName fuelOriginTypeName,
                             AerFuelsAndEmissionsFactors fuelsAndEmissionsFactors,
                             AerPortEmissionsMeasurement totalEmissions) {
        AerPortEmissions portEmissions = getAerPortEmissions(false,
            measuringUnit, totalConsumption, fuelOriginTypeName, null);

        AerPortEmissions expectedPortEmissions = getAerPortEmissions(true,
            measuringUnit, totalConsumption, fuelOriginTypeName, totalEmissions);

        AerShipEmissions shipEmissions = AerShipEmissions.builder()
            .details(AerShipDetails
                .builder()
                .imoNumber(IMO_NUMBER)
                .build()
            )
            .fuelsAndEmissionsFactors(Set.of(fuelsAndEmissionsFactors))
            .build();
        AerEmissions emissions = AerEmissions.builder().ships(Set.of(shipEmissions)).build();

        Aer aer = Aer.builder().emissions(emissions).portEmissions(portEmissions).build();
        Aer expectedAer = Aer.builder().emissions(emissions).portEmissions(expectedPortEmissions).build();

        validator.calculateEmissions(aer);

        assertEquals(expectedAer, aer);
    }

    public static Stream<Arguments> validScenarios() {
        return Stream.of(
            Arguments.of(MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginEFuelTypeName.builder().origin(FuelOrigin.RFNBO).type(EFuelType.E_H2).methaneSlip(new BigDecimal("99.1")).build(),
                AerEFuels.builder()
                    .origin(FuelOrigin.RFNBO)
                    .type(EFuelType.E_H2)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8228013"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("248.7059101"))
                    .total(new BigDecimal("599138.7824275"))
                    .build()
            ),
            Arguments.of(MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginBiofuelTypeName.builder().origin(FuelOrigin.BIOFUEL).type(BioFuelType.BIO_LNG).methaneSlip(new BigDecimal("99.1")).build(),
                AerBioFuels.builder()
                    .origin(FuelOrigin.BIOFUEL)
                    .type(BioFuelType.BIO_LNG)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8228013"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("248.7059101"))
                    .total(new BigDecimal("599138.7824275"))
                    .build()
            ),
            Arguments.of(MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginFossilTypeName.builder().origin(FuelOrigin.FOSSIL).type(FossilFuelType.H2).methaneSlip(new BigDecimal("99.1")).build(),
                AerFossilFuels.builder()
                    .origin(FuelOrigin.FOSSIL)
                    .type(FossilFuelType.H2)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8228013"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("248.7059101"))
                    .total(new BigDecimal("599138.7824275"))
                    .build()),
            Arguments.of(MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginFossilTypeName.builder().origin(FuelOrigin.FOSSIL).type(FossilFuelType.H2).methaneSlip(new BigDecimal("99.1")).build(),
                AerFossilFuels.builder()
                    .origin(FuelOrigin.FOSSIL)
                    .type(FossilFuelType.H2)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8228013"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("248.7059101"))
                    .total(new BigDecimal("599138.7824275"))
                    .build()),
            Arguments.of(MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginFossilTypeName.builder().origin(FuelOrigin.FOSSIL).type(FossilFuelType.H2).methaneSlip(new BigDecimal("99.1")).build(),
                AerFossilFuels.builder()
                    .origin(FuelOrigin.FOSSIL)
                    .type(FossilFuelType.H2)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8228013"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("248.7059101"))
                    .total(new BigDecimal("599138.7824275"))
                    .build()),
            Arguments.of(MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginEFuelTypeName.builder().origin(FuelOrigin.RFNBO).type(EFuelType.OTHER).methaneSlip(new BigDecimal("99.1")).name("name").build(),
                AerEFuels.builder()
                    .origin(FuelOrigin.RFNBO)
                    .type(EFuelType.OTHER)
                    .name("name")
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8228013"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("248.7059101"))
                    .total(new BigDecimal("599138.7824275"))
                    .build()),
            Arguments.of(MeasuringUnit.TONNES, new BigDecimal("1.12345"),
                FuelOriginEFuelTypeName.builder().origin(FuelOrigin.RFNBO).type(EFuelType.OTHER).name("name").methaneSlip(new BigDecimal("99.1")).build(),
                AerEFuels.builder()
                    .origin(FuelOrigin.RFNBO)
                    .name("name")
                    .type(EFuelType.OTHER)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("2400.2926919"))
                    .co2(new BigDecimal("55259.8510160"))
                    .n2o(new BigDecimal("24.6754364"))
                    .total(new BigDecimal("57684.8191443"))
                    .build()
            ),
            Arguments.of(MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginEFuelTypeName.builder().origin(FuelOrigin.RFNBO).type(EFuelType.OTHER).name("name").build(),
                AerEFuels.builder()
                    .origin(FuelOrigin.RFNBO)
                    .type(EFuelType.OTHER)
                    .name("name")
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("2751084.3063422"))
                    .co2(new BigDecimal("63709413.3902172"))
                    .n2o(new BigDecimal("27525.6909664"))
                    .total(new BigDecimal("66488023.3875258"))
                    .build())
        );
    }

    private AerPortEmissions getAerPortEmissions(boolean addCalculatedValues,
                                                 MeasuringUnit measuringUnit,
                                                 BigDecimal totalConsumption,
                                                 FuelOriginTypeName fuelOriginTypeName,
                                                 AerPortEmissionsMeasurement totalEmissions) {
        AerFuelConsumption fuelConsumption = AerFuelConsumption
            .builder()
            .fuelOriginTypeName(fuelOriginTypeName)
            .amount(new BigDecimal("1.12345"))
            .measuringUnit(measuringUnit)
            .fuelDensity(new BigDecimal("10.456"))
            .totalConsumption(addCalculatedValues? totalConsumption: null)
            .build();

        AerPort port = AerPort.builder()
            .imoNumber(IMO_NUMBER)
            .directEmissions(
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("1.1242334"))
                    .co2(new BigDecimal("422.3342121"))
                    .n2o(new BigDecimal("0.9835433"))
                    .total(addCalculatedValues? new BigDecimal("424.4419888"): null)
                    .build()
            )
            .fuelConsumptions(Set.of(fuelConsumption))
            .totalEmissions(totalEmissions)
            .surrenderEmissions(totalEmissions)
            .build();

        return AerPortEmissions.builder().ports(Set.of(port)).build();
    }
}