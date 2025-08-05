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
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.AerFuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.AerFuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.AerFuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerDerogations;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.biofuel.AerBioFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.efuel.AerEFuels;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortDetails;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortEmissions;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortVisit;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyage;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageDetails;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageEmissions;
import uk.gov.mrtm.api.reporting.enumeration.PortCountries;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerAggregatedDataEmissionsCalculatorTest {
    private static final String IMO_NUMBER = "1234567";

    @InjectMocks
    private AerAggregatedDataEmissionsCalculator calculator;

    @ParameterizedTest
    @MethodSource("validIsFromFetchScenarios")
    void calculateEmissions_isFromFetch_false(boolean smallIslandFerryOperatorReduction, boolean hasIceClassDerogation,
                                              AerAggregatedEmissionsMeasurement totalEmissionsFromVoyagesAndPorts,
                                              AerAggregatedEmissionsMeasurement smallIslandSurrenderReduction,
                                              AerPortEmissionsMeasurement lessCapturedCo2,
                                              AerPortEmissionsMeasurement lessVoyagesNotInScope,
                                              AerPortEmissionsMeasurement lessIslandFerryDeduction,
                                              AerPortEmissionsMeasurement less5PercentIceClassDeduction,
                                              BigDecimal totalShipEmissions,
                                              BigDecimal surrenderEmissions) {

        Set<AerAggregatedDataFuelConsumption> fuelConsumptions = Set.of(AerAggregatedDataFuelConsumption.builder()
            .totalConsumption(new BigDecimal("100"))
            .fuelOriginTypeName(
                AerFuelOriginFossilTypeName.builder()
                    .type(FossilFuelType.H2)
                    .origin(FuelOrigin.FOSSIL)
                    .build()
            )
            .build());

        AerAggregatedData aggregatedData = getAerAggregatedData(false, smallIslandFerryOperatorReduction,
            totalEmissionsFromVoyagesAndPorts, smallIslandSurrenderReduction, lessCapturedCo2, lessVoyagesNotInScope,
            lessIslandFerryDeduction, less5PercentIceClassDeduction, totalShipEmissions, surrenderEmissions, fuelConsumptions);

        AerAggregatedData expectedAggregatedData = getAerAggregatedData(true, smallIslandFerryOperatorReduction,
            totalEmissionsFromVoyagesAndPorts, smallIslandSurrenderReduction, lessCapturedCo2, lessVoyagesNotInScope,
            lessIslandFerryDeduction, less5PercentIceClassDeduction, totalShipEmissions, surrenderEmissions, fuelConsumptions);

        AerEmissions emissions = AerEmissions.builder()
            .ships(Set.of(
                AerShipEmissions.builder()
                    .details(
                        AerShipDetails
                            .builder()
                            .imoNumber(IMO_NUMBER)
                            .hasIceClassDerogation(hasIceClassDerogation)
                            .build()
                    )
                    .derogations(
                        AerDerogations
                            .builder()
                            .smallIslandFerryOperatorReduction(smallIslandFerryOperatorReduction)
                            .build()
                    )
                    .build()
            ))
            .build();

        Aer expectedAer = Aer.builder().aggregatedData(expectedAggregatedData).emissions(emissions).build();
        Aer aer = Aer.builder().aggregatedData(aggregatedData).emissions(emissions).build();
        calculator.calculateEmissions(aer);

        assertEquals(expectedAer, aer);
    }

    public static Stream<Arguments> validIsFromFetchScenarios() {
        return Stream.of(
            Arguments.of(true, false,
                AerAggregatedEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1988.5457213"))
                    .co2Captured(new BigDecimal("517.5555443"))
                    .ch4(new BigDecimal("5159.4883096"))
                    .n2o(new BigDecimal("12235.2334456"))
                    .total(new BigDecimal("19383.2674765"))
                    .build(),
                AerAggregatedEmissionsMeasurement.builder()
                    .co2(new BigDecimal("23.5457213"))
                    .co2Captured(new BigDecimal("44.5555443"))
                    .ch4(new BigDecimal("9.4883096"))
                    .n2o(new BigDecimal("9.2334456"))
                    .total(new BigDecimal("42.2674765"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1470.9901770"))
                    .ch4(new BigDecimal("5159.4883096"))
                    .n2o(new BigDecimal("12235.2334456"))
                    .total(new BigDecimal("18865.7119322"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1723.9350604"))
                    .ch4(new BigDecimal("4928.4903959"))
                    .n2o(new BigDecimal("11117.3389395"))
                    .total(new BigDecimal("17769.7643958"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1744.9448834"))
                    .ch4(new BigDecimal("4919.0020863"))
                    .n2o(new BigDecimal("11108.1054939"))
                    .total(new BigDecimal("17772.0524636"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1744.9448834"))
                    .ch4(new BigDecimal("4919.0020863"))
                    .n2o(new BigDecimal("11108.1054939"))
                    .total(new BigDecimal("17772.0524636"))
                    .build(),
                new BigDecimal("17769.7643958"),
                new BigDecimal("17772.0524636")
                ),
            Arguments.of(false, true,
                AerAggregatedEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1988.5457213"))
                    .co2Captured(new BigDecimal("517.5555443"))
                    .ch4(new BigDecimal("5159.4883096"))
                    .n2o(new BigDecimal("12235.2334456"))
                    .total(new BigDecimal("19383.2674765"))
                    .build(),
                null,
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1470.9901770"))
                    .ch4(new BigDecimal("5159.4883096"))
                    .n2o(new BigDecimal("12235.2334456"))
                    .total(new BigDecimal("18865.7119322"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1723.9350604"))
                    .ch4(new BigDecimal("4928.4903959"))
                    .n2o(new BigDecimal("11117.3389395"))
                    .total(new BigDecimal("17769.7643958"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1723.9350604"))
                    .ch4(new BigDecimal("4928.4903959"))
                    .n2o(new BigDecimal("11117.3389395"))
                    .total(new BigDecimal("17769.7643958"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1637.7383074"))
                    .ch4(new BigDecimal("4682.0658761"))
                    .n2o(new BigDecimal("10561.4719925"))
                    .total(new BigDecimal("16881.2761760"))
                    .build(),
                new BigDecimal("17769.7643958"),
                new BigDecimal("16881.2761760")
            ),
            Arguments.of(true, true,
                AerAggregatedEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1988.5457213"))
                    .co2Captured(new BigDecimal("517.5555443"))
                    .ch4(new BigDecimal("5159.4883096"))
                    .n2o(new BigDecimal("12235.2334456"))
                    .total(new BigDecimal("19383.2674765"))
                    .build(),
                AerAggregatedEmissionsMeasurement.builder()
                    .co2(new BigDecimal("23.5457213"))
                    .co2Captured(new BigDecimal("44.5555443"))
                    .ch4(new BigDecimal("9.4883096"))
                    .n2o(new BigDecimal("9.2334456"))
                    .total(new BigDecimal("42.2674765"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1470.9901770"))
                    .ch4(new BigDecimal("5159.4883096"))
                    .n2o(new BigDecimal("12235.2334456"))
                    .total(new BigDecimal("18865.7119322"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1723.9350604"))
                    .ch4(new BigDecimal("4928.4903959"))
                    .n2o(new BigDecimal("11117.3389395"))
                    .total(new BigDecimal("17769.7643958"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1744.9448834"))
                    .ch4(new BigDecimal("4919.0020863"))
                    .n2o(new BigDecimal("11108.1054939"))
                    .total(new BigDecimal("17772.0524636"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1657.6976392"))
                    .ch4(new BigDecimal("4673.0519820"))
                    .n2o(new BigDecimal("10552.7002192"))
                    .total(new BigDecimal("16883.4498404"))
                    .build(),
                new BigDecimal("17769.7643958"),
                new BigDecimal("16883.4498404")
            ),
            Arguments.of(false, false,
                AerAggregatedEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1988.5457213"))
                    .co2Captured(new BigDecimal("517.5555443"))
                    .ch4(new BigDecimal("5159.4883096"))
                    .n2o(new BigDecimal("12235.2334456"))
                    .total(new BigDecimal("19383.2674765"))
                    .build(),
                null,
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1470.9901770"))
                    .ch4(new BigDecimal("5159.4883096"))
                    .n2o(new BigDecimal("12235.2334456"))
                    .total(new BigDecimal("18865.7119322"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1723.9350604"))
                    .ch4(new BigDecimal("4928.4903959"))
                    .n2o(new BigDecimal("11117.3389395"))
                    .total(new BigDecimal("17769.7643958"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1723.9350604"))
                    .ch4(new BigDecimal("4928.4903959"))
                    .n2o(new BigDecimal("11117.3389395"))
                    .total(new BigDecimal("17769.7643958"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .co2(new BigDecimal("1723.9350604"))
                    .ch4(new BigDecimal("4928.4903959"))
                    .n2o(new BigDecimal("11117.3389395"))
                    .total(new BigDecimal("17769.7643958"))
                    .build(),
                new BigDecimal("17769.7643958"),
                new BigDecimal("17769.7643958")
            )
        );
    }

    private static Stream<Arguments> validIsNotFromFetchScenarios() {
        Set<AerAggregatedDataFuelConsumption> fuelConsumptionsWithPortsAndVoyages = Set.of(
            AerAggregatedDataFuelConsumption.builder()
                .totalConsumption(new BigDecimal("1.00000"))
                .fuelOriginTypeName(
                    AerFuelOriginEFuelTypeName.builder()
                        .type(EFuelType.E_DIESEL)
                        .origin(FuelOrigin.RFNBO)
                        .build()
                )
                .build(),
            AerAggregatedDataFuelConsumption.builder()
                .totalConsumption(new BigDecimal("4.00000"))
                .fuelOriginTypeName(
                    AerFuelOriginFossilTypeName.builder()
                        .type(FossilFuelType.H2)
                        .origin(FuelOrigin.FOSSIL)
                        .build()
                )
                .build(),
            AerAggregatedDataFuelConsumption.builder()
                .totalConsumption(new BigDecimal("1.00000"))
                .fuelOriginTypeName(
                    AerFuelOriginBiofuelTypeName.builder()
                        .type(BioFuelType.BIO_LNG)
                        .origin(FuelOrigin.BIOFUEL)
                        .build()
                )
                .build()
        );

        Set<AerAggregatedDataFuelConsumption> fuelConsumptionsWithoutPortsAndVoyages = Set.of(
            AerAggregatedDataFuelConsumption.builder()
                .totalConsumption(new BigDecimal("0.00000"))
                .fuelOriginTypeName(
                    AerFuelOriginBiofuelTypeName.builder()
                        .type(BioFuelType.ETHANOL)
                        .origin(FuelOrigin.BIOFUEL)
                        .build()
                )
                .build(),
            AerAggregatedDataFuelConsumption.builder()
                .totalConsumption(new BigDecimal("0.00000"))
                .fuelOriginTypeName(
                    AerFuelOriginEFuelTypeName.builder()
                        .type(EFuelType.E_H2)
                        .origin(FuelOrigin.RFNBO)
                        .build()
                )
                .build()
        );

        return Stream.of(
            Arguments.of(true, fuelConsumptionsWithPortsAndVoyages),
            Arguments.of(false, fuelConsumptionsWithoutPortsAndVoyages)
        );
    }
    @ParameterizedTest
    @MethodSource("validIsNotFromFetchScenarios")
    void calculateEmissions_isFromFetch_true(boolean hasFuelConsumptions, Set<AerAggregatedDataFuelConsumption> fuelConsumptions) {

        AerAggregatedData aggregatedData = getFetchedAerAggregatedData(false, new HashSet<>());
        AerAggregatedData expectedAggregatedData = getFetchedAerAggregatedData(true, fuelConsumptions);

        AerEmissions emissions = AerEmissions.builder()
            .ships(
                Set.of(
                    AerShipEmissions
                        .builder()
                        .details(AerShipDetails.builder().imoNumber(IMO_NUMBER).hasIceClassDerogation(true).build())
                        .fuelsAndEmissionsFactors(Set.of(
                            AerBioFuels.builder().type(BioFuelType.ETHANOL).origin(FuelOrigin.BIOFUEL).uniqueIdentifier(UUID.randomUUID()).build(),
                            AerEFuels.builder().type(EFuelType.E_H2).origin(FuelOrigin.RFNBO).uniqueIdentifier(UUID.randomUUID()).build()
                        ))
                        .derogations(AerDerogations.builder().smallIslandFerryOperatorReduction(true).build()).build())
            )
            .build();

        AerPortEmissions portEmissions = AerPortEmissions.builder()
            .ports(Set.of(
                AerPort.builder()
                    .portDetails(AerPortDetails.builder().build())
                    .fuelConsumptions(hasFuelConsumptions ? Set.of(
                        AerFuelConsumption.builder()
                            .fuelOriginTypeName(
                                FuelOriginFossilTypeName.builder()
                                    .type(FossilFuelType.H2)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .origin(FuelOrigin.FOSSIL)
                                    .build()
                            )
                            .uniqueIdentifier(UUID.randomUUID())
                            .totalConsumption(new BigDecimal("1"))
                            .build(),
                        AerFuelConsumption.builder()
                            .fuelOriginTypeName(
                                FuelOriginFossilTypeName.builder()
                                    .type(FossilFuelType.H2)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .origin(FuelOrigin.FOSSIL)
                                    .build()
                            )
                            .uniqueIdentifier(UUID.randomUUID())
                            .totalConsumption(new BigDecimal("1"))
                            .build()) : new HashSet<>()
                    )
                    .totalEmissions(
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("42.4531532"))
                            .ch4(new BigDecimal("52.7924742"))
                            .n2o(new BigDecimal("64.2453632"))
                            .total(new BigDecimal("75.5235211"))
                            .build())
                    .imoNumber(IMO_NUMBER)
                    .build(),
                AerPort.builder()
                    .portDetails(
                        AerPortDetails.builder()
                            .smallIslandFerryReduction(true)
                            .ccs(new BigDecimal("1.11"))
                            .ccu(new BigDecimal("2.34"))
                            .build()
                    )
                    .fuelConsumptions(hasFuelConsumptions ? Set.of(
                        AerFuelConsumption.builder()
                            .fuelOriginTypeName(
                                FuelOriginFossilTypeName.builder()
                                    .type(FossilFuelType.H2)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .origin(FuelOrigin.FOSSIL)
                                    .build()
                            )
                            .uniqueIdentifier(UUID.randomUUID())
                            .totalConsumption(new BigDecimal("1"))
                            .build(),
                        AerFuelConsumption.builder()
                            .fuelOriginTypeName(
                                FuelOriginBiofuelTypeName.builder()
                                    .type(BioFuelType.BIO_LNG)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .origin(FuelOrigin.BIOFUEL)
                                    .build()
                            )
                            .uniqueIdentifier(UUID.randomUUID())
                            .totalConsumption(new BigDecimal("1"))
                            .build()) : new HashSet<>()
                    )
                    .totalEmissions(
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("52.3523566"))
                            .ch4(new BigDecimal("67.6253242"))
                            .n2o(new BigDecimal("83.5235234"))
                            .total(new BigDecimal("203.5012042"))
                            .build())
                    .imoNumber(IMO_NUMBER)
                    .build(),
                AerPort.builder()
                    .portDetails(AerPortDetails.builder().build())
                    .totalEmissions(
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("2.2412452"))
                            .ch4(new BigDecimal("2.1235123"))
                            .n2o(new BigDecimal("4.2542521"))
                            .total(new BigDecimal("5.5124121"))
                            .build())
                    .imoNumber("7654321")
                    .build()
                )
            )
            .build();

        AerVoyageEmissions voyageEmissions = AerVoyageEmissions.builder()
            .voyages(Set.of(
                AerVoyage.builder()
                    .imoNumber(IMO_NUMBER)
                    .voyageDetails(AerVoyageDetails.builder()
                        .ccu(new BigDecimal("5.23"))
                        .ccs(new BigDecimal("9.52"))
                        .arrivalPort(AerPortVisit.builder().country(PortCountries.GB).build())
                        .departurePort(AerPortVisit.builder().country(PortCountries.GR).build())
                        .build())
                    .fuelConsumptions(hasFuelConsumptions ? Set.of(
                        AerFuelConsumption.builder()
                            .fuelOriginTypeName(
                                FuelOriginFossilTypeName.builder()
                                    .type(FossilFuelType.H2)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .origin(FuelOrigin.FOSSIL)
                                    .build()
                            )
                            .uniqueIdentifier(UUID.randomUUID())
                            .totalConsumption(new BigDecimal("1"))
                            .build(),
                        AerFuelConsumption.builder()
                            .fuelOriginTypeName(
                                FuelOriginEFuelTypeName.builder()
                                    .type(EFuelType.E_DIESEL)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .origin(FuelOrigin.RFNBO)
                                    .build()
                            )
                            .uniqueIdentifier(UUID.randomUUID())
                            .totalConsumption(new BigDecimal("1"))
                            .build()) : new HashSet<>()
                    )
                    .totalEmissions(
                        AerPortEmissionsMeasurement.builder()
                        .co2(new BigDecimal("2.2412452"))
                        .ch4(new BigDecimal("2.1235123"))
                        .n2o(new BigDecimal("4.2542521"))
                        .total(new BigDecimal("5.5124121"))
                        .build())
                    .build(),
                AerVoyage.builder()
                    .imoNumber(IMO_NUMBER)
                    .voyageDetails(AerVoyageDetails.builder()
                        .smallIslandFerryReduction(true)
                        .ccu(new BigDecimal("1.33"))
                        .ccs(new BigDecimal("6.44"))
                        .arrivalPort(AerPortVisit.builder().country(PortCountries.US).build())
                        .departurePort(AerPortVisit.builder().country(PortCountries.MX).build())
                        .build())
                    .totalEmissions(
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("1232.2315231"))
                            .ch4(new BigDecimal("22.1412432"))
                            .n2o(new BigDecimal("41.1512423"))
                            .total(new BigDecimal("65.1241231"))
                            .build())
                    .build(),
                AerVoyage.builder()
                    .imoNumber(IMO_NUMBER)
                    .voyageDetails(AerVoyageDetails.builder()
                        .smallIslandFerryReduction(true)
                        .arrivalPort(AerPortVisit.builder().country(PortCountries.ES).build())
                        .departurePort(AerPortVisit.builder().country(PortCountries.GB).build())
                        .build())
                    .totalEmissions(
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("4.1234123"))
                            .ch4(new BigDecimal("56.5235423"))
                            .n2o(new BigDecimal("6.2215425"))
                            .total(new BigDecimal("66.8684971"))
                            .build())
                    .build(),
                AerVoyage.builder()
                    .imoNumber("7654321")
                    .voyageDetails(AerVoyageDetails.builder()
                        .arrivalPort(AerPortVisit.builder().country(PortCountries.ES).build())
                        .departurePort(AerPortVisit.builder().country(PortCountries.GB).build())
                        .build())
                    .totalEmissions(
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("523.1245121"))
                            .ch4(new BigDecimal("231.5235341"))
                            .n2o(new BigDecimal("52.5124213"))
                            .total(new BigDecimal("523.1512423"))
                            .build())
                    .build(),
                AerVoyage.builder()
                    .imoNumber(IMO_NUMBER)
                    .voyageDetails(AerVoyageDetails.builder()
                        .ccu(new BigDecimal("9.76"))
                        .ccs(new BigDecimal("8.11"))
                        .arrivalPort(AerPortVisit.builder().country(PortCountries.GB).build())
                        .departurePort(AerPortVisit.builder().country(PortCountries.GB).build())
                        .build())
                    .totalEmissions(
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("212.1412412"))
                            .ch4(new BigDecimal("25.1241231"))
                            .n2o(new BigDecimal("44.1245124"))
                            .total(new BigDecimal("512.1241242"))
                            .build())
                    .build(),
                AerVoyage.builder()
                    .imoNumber(IMO_NUMBER)
                    .voyageDetails(AerVoyageDetails.builder()
                        .arrivalPort(AerPortVisit.builder().country(PortCountries.GB).build())
                        .departurePort(AerPortVisit.builder().country(PortCountries.GB).build())
                        .build())
                    .totalEmissions(
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("421.3124123"))
                            .ch4(new BigDecimal("22.1241231"))
                            .n2o(new BigDecimal("451.1412412"))
                            .total(new BigDecimal("10.1241241"))
                            .build())
                    .build(),
                AerVoyage.builder()
                    .imoNumber("7654321")
                    .voyageDetails(AerVoyageDetails.builder()
                        .arrivalPort(AerPortVisit.builder().country(PortCountries.GB).build())
                        .departurePort(AerPortVisit.builder().country(PortCountries.GB).build())
                        .build())
                    .totalEmissions(
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("123.1231241"))
                            .ch4(new BigDecimal("124.5243231"))
                            .n2o(new BigDecimal("1.1241243"))
                            .total(new BigDecimal("98.2152341"))
                            .build())
                    .build()
                )
            )
            .build();

        Aer aer = Aer.builder().emissions(emissions).aggregatedData(aggregatedData).voyageEmissions(voyageEmissions).portEmissions(portEmissions).build();
        Aer expectedAer = Aer.builder().emissions(emissions).aggregatedData(expectedAggregatedData).voyageEmissions(voyageEmissions).portEmissions(portEmissions).build();
        calculator.calculateEmissions(aer);
        assertEquals(expectedAer, aer);
    }

    private AerAggregatedData getFetchedAerAggregatedData(boolean addCalculatedValues,
                                                          Set<AerAggregatedDataFuelConsumption> fuelConsumptions) {
        return AerAggregatedData.builder()
            .emissions(Set.of(AerShipAggregatedData.builder()
                .imoNumber(IMO_NUMBER)
                .isFromFetch(true)
                .fuelConsumptions(fuelConsumptions)
                .emissionsWithinUKPorts(
                    AerAggregatedEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("94.8055098"))
                        .co2Captured(new BigDecimal("3.4500000"))
                        .ch4(new BigDecimal("120.4177984"))
                        .n2o(new BigDecimal("147.7688866"))
                        .total(addCalculatedValues? new BigDecimal("362.9921948"): null)
                        .build()
                )
                .emissionsBetweenUKPorts(
                    AerAggregatedEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("633.4536535"))
                        .co2Captured(new BigDecimal("17.8700000"))
                        .ch4(new BigDecimal("47.2482462"))
                        .n2o(new BigDecimal("495.2657536"))
                        .total(addCalculatedValues? new BigDecimal("1175.9676533"): null)
                        .build()
                )
                .emissionsBetweenUKAndEEAVoyages(
                    AerAggregatedEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("6.3646575"))
                        .co2Captured(new BigDecimal("14.7500000"))
                        .ch4(new BigDecimal("58.6470546"))
                        .n2o(new BigDecimal("10.4757946"))
                        .total(addCalculatedValues? new BigDecimal("75.4875067"): null)
                        .build()
                )
                .totalAggregatedEmissions(
                    AerAggregatedEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("734.6238208"))
                        .co2Captured(new BigDecimal("36.0700000"))
                        .ch4(new BigDecimal("226.3130992"))
                        .n2o(new BigDecimal("653.5104348"))
                        .total(addCalculatedValues? new BigDecimal("1614.4473548"): null)
                        .build()
                )
                .smallIslandSurrenderReduction(
                    AerAggregatedEmissionsMeasurement
                    .builder()
                    .co2(new BigDecimal("56.4757689"))
                    .co2Captured(new BigDecimal("3.4500000"))
                    .ch4(new BigDecimal("124.1488665"))
                    .n2o(new BigDecimal("89.7450659"))
                    .total(addCalculatedValues? new BigDecimal("270.3697013"): null)
                    .build()
                )
                .totalEmissionsFromVoyagesAndPorts(
                    AerPortEmissionsMeasurement
                    .builder()
                    .co2(new BigDecimal("734.6238208"))
                    .ch4(new BigDecimal("226.3130992"))
                    .n2o(new BigDecimal("653.5104348"))
                    .total(addCalculatedValues? new BigDecimal("1614.4473548"): null)
                    .build()
                )
                .lessCapturedCo2(
                    AerPortEmissionsMeasurement
                    .builder()
                    .co2(new BigDecimal("698.5538208"))
                    .ch4(new BigDecimal("226.3130992"))
                    .n2o(new BigDecimal("653.5104348"))
                    .total(addCalculatedValues? new BigDecimal("1578.3773548"): null)
                    .build()
                )
                .lessVoyagesNotInScope(
                    AerPortEmissionsMeasurement
                    .builder()
                    .co2(new BigDecimal("702.7464921"))
                    .ch4(new BigDecimal("196.9895719"))
                    .n2o(new BigDecimal("648.2725375"))
                    .total(addCalculatedValues? new BigDecimal("1548.0086015"): null)
                    .build()
                )
                .lessIslandFerryDeduction(
                    AerPortEmissionsMeasurement
                    .builder()
                    .co2(new BigDecimal("649.7207232"))
                    .ch4(new BigDecimal("72.8407054"))
                    .n2o(new BigDecimal("558.5274716"))
                    .total(addCalculatedValues? new BigDecimal("1281.0889002"): null)
                    .build()
                )
                .less5PercentIceClassDeduction(
                    AerPortEmissionsMeasurement
                    .builder()
                    .co2(new BigDecimal("617.2346870"))
                    .ch4(new BigDecimal("69.1986701"))
                    .n2o(new BigDecimal("530.6010980"))
                    .total(addCalculatedValues? new BigDecimal("1217.0344551"): null)
                    .build()
                )
                .totalShipEmissions(addCalculatedValues? new BigDecimal("1548.0086015"): null)
                .surrenderEmissions(addCalculatedValues? new BigDecimal("1217.0344551"): null)
                .build()))
            .build();
    }

    private AerAggregatedData getAerAggregatedData(boolean addCalculatedValues,
                                                   boolean smallIslandFerryOperatorReduction,
                                                   AerAggregatedEmissionsMeasurement totalEmissionsFromVoyagesAndPorts,
                                                   AerAggregatedEmissionsMeasurement smallIslandSurrenderReduction,
                                                   AerPortEmissionsMeasurement lessCapturedCo2,
                                                   AerPortEmissionsMeasurement lessVoyagesNotInScope,
                                                   AerPortEmissionsMeasurement lessIslandFerryDeduction,
                                                   AerPortEmissionsMeasurement less5PercentIceClassDeduction,
                                                   BigDecimal totalShipEmissions,
                                                   BigDecimal surrenderEmissions,
                                                   Set<AerAggregatedDataFuelConsumption> fuelConsumptions) {
        return AerAggregatedData.builder()
            .emissions(Set.of(AerShipAggregatedData.builder()
                .imoNumber(IMO_NUMBER)
                .isFromFetch(false)
                .fuelConsumptions(fuelConsumptions)
                .emissionsWithinUKPorts(
                    AerAggregatedEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("1742.4231535"))
                        .co2Captured(new BigDecimal("1.9876543"))
                        .ch4(new BigDecimal("2355.4924821"))
                        .n2o(new BigDecimal("6542.5678901"))
                        .total(addCalculatedValues? new BigDecimal("10640.4835257"): null)
                        .build()
                )
                .emissionsBetweenUKPorts(
                    AerAggregatedEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("239.4444444"))
                        .co2Captured(new BigDecimal("2.9999999"))
                        .ch4(new BigDecimal("2342.0000001"))
                        .n2o(new BigDecimal("3456.8765432"))
                        .total(addCalculatedValues? new BigDecimal("6038.3209877"): null)
                        .build()
                )
                .emissionsBetweenUKAndEEAVoyages(
                    AerAggregatedEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("6.6781234"))
                        .co2Captured(new BigDecimal("512.5678901"))
                        .ch4(new BigDecimal("461.9958274"))
                        .n2o(new BigDecimal("2235.7890123"))
                        .total(addCalculatedValues? new BigDecimal("2704.4629631"): null)
                        .build()
                )
                .totalAggregatedEmissions(addCalculatedValues? totalEmissionsFromVoyagesAndPorts: null)
                .smallIslandSurrenderReduction(
                    smallIslandFerryOperatorReduction ?
                        AerAggregatedEmissionsMeasurement
                            .builder()
                            .co2(smallIslandSurrenderReduction.getCo2())
                            .co2Captured(smallIslandSurrenderReduction.getCo2Captured())
                            .ch4(smallIslandSurrenderReduction.getCh4())
                            .n2o(smallIslandSurrenderReduction.getN2o())
                            .total(addCalculatedValues? smallIslandSurrenderReduction.getTotal(): null)
                            .build(): null)
                .totalEmissionsFromVoyagesAndPorts(AerPortEmissionsMeasurement
                    .builder()
                    .co2(totalEmissionsFromVoyagesAndPorts.getCo2())
                    .ch4(totalEmissionsFromVoyagesAndPorts.getCh4())
                    .n2o(totalEmissionsFromVoyagesAndPorts.getN2o())
                    .total(addCalculatedValues? totalEmissionsFromVoyagesAndPorts.getTotal(): null)
                    .build())
                .lessCapturedCo2(addCalculatedValues? lessCapturedCo2: null)
                .lessVoyagesNotInScope(addCalculatedValues? lessVoyagesNotInScope: null)
                .lessIslandFerryDeduction(addCalculatedValues ? lessIslandFerryDeduction: null)
                .less5PercentIceClassDeduction(addCalculatedValues ? less5PercentIceClassDeduction: null)
                .totalShipEmissions(addCalculatedValues? totalShipEmissions: null)
                .surrenderEmissions(addCalculatedValues? surrenderEmissions: null)
                .build()))
            .build();
    }

}