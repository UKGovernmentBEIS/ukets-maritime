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
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.biofuel.AerBioFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.efuel.AerEFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil.AerFossilFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortDetails;
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
    void calculate_Emissions(boolean smallIslandFerryReduction, boolean hasIceClassDerogation, boolean hasCcsAndCcu,
                             MeasuringUnit measuringUnit,
                             BigDecimal totalConsumption,
                             FuelOriginTypeName fuelOriginTypeName,
                             AerFuelsAndEmissionsFactors fuelsAndEmissionsFactors,
                             AerPortEmissionsMeasurement surrenderEmissions,
                             AerPortEmissionsMeasurement totalEmissions) {
        AerPortEmissions portEmissions = getAerPortEmissions(false, smallIslandFerryReduction, hasCcsAndCcu,
            measuringUnit, totalConsumption, fuelOriginTypeName, surrenderEmissions, totalEmissions);

        AerPortEmissions expectedPortEmissions = getAerPortEmissions(true, smallIslandFerryReduction, hasCcsAndCcu,
            measuringUnit, totalConsumption, fuelOriginTypeName, surrenderEmissions, totalEmissions);

        AerShipEmissions shipEmissions = AerShipEmissions.builder()
            .details(AerShipDetails
                .builder()
                .imoNumber(IMO_NUMBER)
                .hasIceClassDerogation(hasIceClassDerogation)
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

    private AerPortEmissions getAerPortEmissions(boolean addCalculatedValues,
                                                 boolean smallIslandFerryReduction,
                                                 boolean hasCcsAndCcu,
                                                 MeasuringUnit measuringUnit,
                                                 BigDecimal totalConsumption,
                                                 FuelOriginTypeName fuelOriginTypeName,
                                                 AerPortEmissionsMeasurement surrenderEmissions,
                                                 AerPortEmissionsMeasurement totalEmissions) {
        AerPortDetails portDetails = AerPortDetails
            .builder()
            .smallIslandFerryReduction(smallIslandFerryReduction)
            .ccs(hasCcsAndCcu ? new BigDecimal("1.13") : null)
            .ccu(hasCcsAndCcu ? new BigDecimal("2.55") : null)
            .build();

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
            .portDetails(portDetails)
            .directEmissions(
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("1.1242334"))
                    .co2(new BigDecimal("422.3342121"))
                    .n2o(new BigDecimal("0.9835433"))
                    .total(addCalculatedValues? new BigDecimal("424.4419888"): null)
                    .build()
            )
            .fuelConsumptions(Set.of(fuelConsumption))
            .totalEmissions(
                AerPortEmissionsMeasurement.builder()
                    .ch4(totalEmissions.getCh4())
                    .co2(totalEmissions.getCo2())
                    .n2o(totalEmissions.getN2o())
                    .total(addCalculatedValues? totalEmissions.getTotal(): null)
                    .build()
            )
            .surrenderEmissions(
                AerPortEmissionsMeasurement.builder()
                    .ch4(surrenderEmissions.getCh4())
                    .co2(surrenderEmissions.getCo2())
                    .n2o(surrenderEmissions.getN2o())
                    .total(addCalculatedValues? surrenderEmissions.getTotal(): null)
                    .build()
            )
            .build();

        return AerPortEmissions.builder().ports(Set.of(port)).build();
    }

    public static Stream<Arguments> validScenarios() {
        return Stream.of(
            Arguments.of(true, false, false, MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginEFuelTypeName.builder().origin(FuelOrigin.RFNBO).type(EFuelType.E_H2).methaneSlip(new BigDecimal("99.1")).build(),
                AerEFuels.builder()
                    .origin(FuelOrigin.RFNBO)
                    .type(EFuelType.E_H2)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("0.0000000"))
                    .co2(new BigDecimal("0.0000000"))
                    .n2o(new BigDecimal("0.0000000"))
                    .total(new BigDecimal("0.0000000"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("26699.4748521"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("256.1843212"))
                    .total(new BigDecimal("600758.9128894"))
                    .build()
            ),
            Arguments.of(true, true, false, MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginBiofuelTypeName.builder().origin(FuelOrigin.BIOFUEL).type(BioFuelType.BIO_LNG).methaneSlip(new BigDecimal("99.1")).build(),
                AerBioFuels.builder()
                    .origin(FuelOrigin.BIOFUEL)
                    .type(BioFuelType.BIO_LNG)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("0.0000000"))
                    .co2(new BigDecimal("0.0000000"))
                    .n2o(new BigDecimal("0.0000000"))
                    .total(new BigDecimal("0.0000000"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("26699.4748521"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("256.1843212"))
                    .total(new BigDecimal("600758.9128894"))
                    .build()
            ),
            Arguments.of(true, true, true, MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginFossilTypeName.builder().origin(FuelOrigin.FOSSIL).type(FossilFuelType.H2).methaneSlip(new BigDecimal("99.1")).build(),
                AerFossilFuels.builder()
                    .origin(FuelOrigin.FOSSIL)
                    .type(FossilFuelType.H2)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("0.0000000"))
                    .co2(new BigDecimal("0.0000000"))
                    .n2o(new BigDecimal("0.0000000"))
                    .total(new BigDecimal("0.0000000"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("26699.4748521"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("256.1843212"))
                    .total(new BigDecimal("600758.9128894"))
                    .build()),
            Arguments.of(false, true, true, MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginFossilTypeName.builder().origin(FuelOrigin.FOSSIL).type(FossilFuelType.H2).methaneSlip(new BigDecimal("99.1")).build(),
                AerFossilFuels.builder()
                    .origin(FuelOrigin.FOSSIL)
                    .type(FossilFuelType.H2)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25364.5011095"))
                    .co2(new BigDecimal("545109.5950303"))
                    .n2o(new BigDecimal("243.3751051"))
                    .total(new BigDecimal("570717.4712449"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("26699.4748521"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("256.1843212"))
                    .total(new BigDecimal("600758.9128894"))
                    .build()),
            Arguments.of(false, true, false, MeasuringUnit.M3, new BigDecimal("11.74679"),
                FuelOriginFossilTypeName.builder().origin(FuelOrigin.FOSSIL).type(FossilFuelType.H2).methaneSlip(new BigDecimal("99.1")).build(),
                AerFossilFuels.builder()
                    .origin(FuelOrigin.FOSSIL)
                    .type(FossilFuelType.H2)
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25364.5011095"))
                    .co2(new BigDecimal("545113.0910303"))
                    .n2o(new BigDecimal("243.3751051"))
                    .total(new BigDecimal("570720.9672449"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("26699.4748521"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("256.1843212"))
                    .total(new BigDecimal("600758.9128894"))
                    .build()),
            Arguments.of(false, false, false, MeasuringUnit.M3, new BigDecimal("11.74679"),
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
                    .ch4(new BigDecimal("26699.4748521"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("256.1843212"))
                    .total(new BigDecimal("600758.9128894"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("26699.4748521"))
                    .co2(new BigDecimal("573803.2537161"))
                    .n2o(new BigDecimal("256.1843212"))
                    .total(new BigDecimal("600758.9128894"))
                    .build()),
            Arguments.of(false, false, false, MeasuringUnit.TONNES, new BigDecimal("1.12345"),
                FuelOriginEFuelTypeName.builder().origin(FuelOrigin.RFNBO).name("name").methaneSlip(new BigDecimal("99.1")).build(),
                AerEFuels.builder()
                    .origin(FuelOrigin.RFNBO)
                    .name("name")
                    .carbonDioxide(new BigDecimal("5423523.45245"))
                    .methane(new BigDecimal("8364.24"))
                    .nitrousOxide(new BigDecimal("8.842145"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("2554.5249499"))
                    .co2(new BigDecimal("55259.8510160"))
                    .n2o(new BigDecimal("25.3906634"))
                    .total(new BigDecimal("57839.7666293"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("2554.5249499"))
                    .co2(new BigDecimal("55259.8510160"))
                    .n2o(new BigDecimal("25.3906634"))
                    .total(new BigDecimal("57839.7666293"))
                    .build()
            ),
            Arguments.of(false, false, false, MeasuringUnit.M3, new BigDecimal("11.74679"),
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
                    .ch4(new BigDecimal("2927939.6537635"))
                    .co2(new BigDecimal("63709413.3902172"))
                    .n2o(new BigDecimal("28356.6255301"))
                    .total(new BigDecimal("66665709.6695108"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("2927939.6537635"))
                    .co2(new BigDecimal("63709413.3902172"))
                    .n2o(new BigDecimal("28356.6255301"))
                    .total(new BigDecimal("66665709.6695108"))
                    .build())
        );
    }
}