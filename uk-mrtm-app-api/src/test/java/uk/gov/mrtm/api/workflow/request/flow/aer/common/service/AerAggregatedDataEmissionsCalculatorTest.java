package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.Test;
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
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
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
import uk.gov.mrtm.api.reporting.enumeration.PortCodes1;
import uk.gov.mrtm.api.reporting.enumeration.PortCodes2;
import uk.gov.mrtm.api.reporting.enumeration.PortCodesNorthernIreland;
import uk.gov.mrtm.api.reporting.enumeration.PortCountries;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerAggregatedDataEmissionsCalculatorTest {
    private final String IMO_NUMBER = "1234567";

    @InjectMocks
    private AerAggregatedDataEmissionsCalculator calculator;

    @Test
    void calculateEmissions_isFromFetch_false() {
        AerPortEmissionsMeasurement totalEmissionsFromVoyagesAndPorts =  AerPortEmissionsMeasurement.builder()
            .co2(new BigDecimal("1988.5457213"))
            .ch4(new BigDecimal("5159.4883096"))
            .n2o(new BigDecimal("12235.2334456"))
            .total(new BigDecimal("19383.2674765"))
            .build();

        AerPortEmissionsMeasurement lessVoyagesInNorthernIrelandDeduction = AerPortEmissionsMeasurement.builder()
            .co2(new BigDecimal("1985.2066596"))
            .ch4(new BigDecimal("4928.4903959"))
            .n2o(new BigDecimal("11117.3389395"))
            .total(new BigDecimal("18031.0359950"))
            .build();

        BigDecimal totalShipEmissions = new BigDecimal("19383.2674765");
        BigDecimal surrenderEmissions = new BigDecimal("18031.0359950");

        Set<AerAggregatedDataFuelConsumption> fuelConsumptions = Set.of(AerAggregatedDataFuelConsumption.builder()
            .totalConsumption(new BigDecimal("100"))
            .fuelOriginTypeName(
                AerFuelOriginFossilTypeName.builder()
                    .type(FossilFuelType.H2)
                    .origin(FuelOrigin.FOSSIL)
                    .build()
            )
            .build());

        AerAggregatedData aggregatedData = getAerAggregatedData(false, totalEmissionsFromVoyagesAndPorts,
            lessVoyagesInNorthernIrelandDeduction, totalShipEmissions, surrenderEmissions, fuelConsumptions);

        AerAggregatedData expectedAggregatedData = getAerAggregatedData(true, totalEmissionsFromVoyagesAndPorts,
            lessVoyagesInNorthernIrelandDeduction, totalShipEmissions, surrenderEmissions, fuelConsumptions);

        AerEmissions emissions = AerEmissions.builder()
            .ships(Set.of(
                AerShipEmissions.builder()
                    .details(
                        AerShipDetails
                            .builder()
                            .imoNumber(IMO_NUMBER)
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
                        .details(AerShipDetails.builder().imoNumber(IMO_NUMBER).build())
                        .fuelsAndEmissionsFactors(Set.of(
                            AerBioFuels.builder().type(BioFuelType.ETHANOL).origin(FuelOrigin.BIOFUEL).uniqueIdentifier(UUID.randomUUID()).build(),
                            AerEFuels.builder().type(EFuelType.E_H2).origin(FuelOrigin.RFNBO).uniqueIdentifier(UUID.randomUUID()).build()
                        ))
                        .build())
            )
            .build();

        AerPortEmissions portEmissions = getAerPortEmissions(hasFuelConsumptions);

        AerVoyageEmissions voyageEmissions = getAerVoyageEmissions(hasFuelConsumptions);

        Aer aer = Aer.builder().emissions(emissions).aggregatedData(aggregatedData).voyageEmissions(voyageEmissions).portEmissions(portEmissions).build();
        Aer expectedAer = Aer.builder().emissions(emissions).aggregatedData(expectedAggregatedData).voyageEmissions(voyageEmissions).portEmissions(portEmissions).build();
        calculator.calculateEmissions(aer);
        assertEquals(expectedAer, aer);
    }

    private static Stream<Arguments> validIsNotFromFetchScenarios() {
        Set<AerAggregatedDataFuelConsumption> fuelConsumptionsWithPortsAndVoyages = Set.of(
            AerAggregatedDataFuelConsumption.builder()
                .totalConsumption(new BigDecimal("4.00000"))
                .fuelOriginTypeName(
                    AerFuelOriginEFuelTypeName.builder()
                        .type(EFuelType.E_DIESEL)
                        .origin(FuelOrigin.RFNBO)
                        .build()
                )
                .build(),
            AerAggregatedDataFuelConsumption.builder()
                .totalConsumption(new BigDecimal("6.00000"))
                .fuelOriginTypeName(
                    AerFuelOriginFossilTypeName.builder()
                        .type(FossilFuelType.H2)
                        .origin(FuelOrigin.FOSSIL)
                        .build()
                )
                .build(),
            AerAggregatedDataFuelConsumption.builder()
                .totalConsumption(new BigDecimal("2.00000"))
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

    @Test
    void calculateEmissions_all_data_filtered_out() {
        String imoNumber1 = "1000000";
        String imoNumber2 = "2000000";
        String imoNumber3 = "3000000";
        String imoNumber4 = "4000000";
        String imoNumber5 = "5000000";

        AerPortEmissions portEmissions = AerPortEmissions.builder()
            .ports(Set.of(
                AerPort.builder().imoNumber(imoNumber4).build()
            ))
            .build();

        AerVoyageEmissions voyageEmissions = AerVoyageEmissions.builder()
            .voyages(Set.of(
                getAerVoyage(
                    imoNumber1,
                    PortCountries.GR, PortCodes2.GRKAK.name(), PortCountries.GB, PortCodes1.GBAYW.name(),
                    null,
                    false),
                getAerVoyage(
                    imoNumber3,
                    PortCountries.GB, PortCodesNorthernIreland.GBLDY.name(), PortCountries.GB, PortCodes1.GBAYW.name(),
                    null,
                    false),
                getAerVoyage(
                    imoNumber5,
                    PortCountries.GB, PortCodes1.GBABD.name(), PortCountries.GB, PortCodes1.GBAYW.name(),
                    null,
                    false),
                getAerVoyage(
                    imoNumber2,
                    PortCountries.US, PortCodes2.USBAL.name(), PortCountries.CU, PortCodes1.CUHAV.name(),
                    null,
                    false)
            ))
            .build();

        Aer aer = Aer.builder()
            .portEmissions(portEmissions)
            .voyageEmissions(voyageEmissions)
            .emissions(AerEmissions.builder().build())
            .aggregatedData(AerAggregatedData.builder().emissions(new HashSet<>(Set.of(
                AerShipAggregatedData.builder().isFromFetch(true).imoNumber(imoNumber1).build(),
                AerShipAggregatedData.builder().isFromFetch(true).imoNumber(imoNumber2).build(),
                AerShipAggregatedData.builder().isFromFetch(true).imoNumber(imoNumber3).build(),
                AerShipAggregatedData.builder().isFromFetch(true).imoNumber(imoNumber4).build(),
                AerShipAggregatedData.builder().isFromFetch(true).imoNumber(imoNumber5).build()
            ))).build())
            .build();

        Aer expectedAer = Aer.builder()
            .portEmissions(portEmissions)
            .voyageEmissions(voyageEmissions)
            .emissions(AerEmissions.builder().build())
            .aggregatedData(AerAggregatedData.builder().emissions(new  HashSet<>(Set.of(
                AerShipAggregatedData.builder().isFromFetch(true).imoNumber(imoNumber3).build(),
                AerShipAggregatedData.builder().isFromFetch(true).imoNumber(imoNumber4).build(),
                AerShipAggregatedData.builder().isFromFetch(true).imoNumber(imoNumber5).build()
            ))).build())
            .build();

        calculator.calculateEmissions(aer);

        assertEquals(expectedAer, aer);
    }

    private AerPortEmissions getAerPortEmissions(boolean hasFuelConsumptions) {
        return AerPortEmissions.builder()
            .ports(Set.of(
                getAerPort(
                    IMO_NUMBER,
                    hasFuelConsumptions,
                    AerPortEmissionsMeasurement.builder()
                        .co2(new BigDecimal("42.4531532"))
                        .ch4(new BigDecimal("52.7924742"))
                        .n2o(new BigDecimal("64.2453632"))
                        .total(new BigDecimal("75.5235211"))
                        .build()
                ),
                getAerPort(
                    IMO_NUMBER,
                    hasFuelConsumptions,
                    AerPortEmissionsMeasurement.builder()
                        .co2(new BigDecimal("52.3523566"))
                        .ch4(new BigDecimal("67.6253242"))
                        .n2o(new BigDecimal("83.5235234"))
                        .total(new BigDecimal("203.5012042"))
                        .build()
                ),
                getAerPort(
                    "7654321",
                    hasFuelConsumptions,
                    AerPortEmissionsMeasurement.builder()
                        .co2(new BigDecimal("2.2412452"))
                        .ch4(new BigDecimal("2.1235123"))
                        .n2o(new BigDecimal("4.2542521"))
                        .total(new BigDecimal("5.5124121"))
                        .build()
                )
                )
            )
            .build();
    }

    private AerVoyageEmissions getAerVoyageEmissions(boolean hasFuelConsumptions) {
        return AerVoyageEmissions.builder()
            .voyages(Set.of(
                    getAerVoyage(
                        "7654321",
                        PortCountries.GB, PortCodesNorthernIreland.GBLDY.name(), PortCountries.GB, PortCodes1.GBAYW.name(),
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("2.2412452"))
                            .ch4(new BigDecimal("2.1235123"))
                            .n2o(new BigDecimal("4.2542521"))
                            .total(new BigDecimal("5.5124121"))
                            .build(),
                        hasFuelConsumptions),
                    getAerVoyage(
                        IMO_NUMBER,
                        PortCountries.GB, PortCodesNorthernIreland.GBLDY.name(), PortCountries.GB, PortCodes1.GBAYW.name(),
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("2.2412452"))
                            .ch4(new BigDecimal("2.1235123"))
                            .n2o(new BigDecimal("4.2542521"))
                            .total(new BigDecimal("5.5124121"))
                            .build(),
                        hasFuelConsumptions),
                    getAerVoyage(
                        IMO_NUMBER,
                        PortCountries.GB, PortCodes1.GBBUC.name(), PortCountries.GB, PortCodesNorthernIreland.GBCLR.name(),
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("4.1234123"))
                            .ch4(new BigDecimal("56.5235423"))
                            .n2o(new BigDecimal("6.2215425"))
                            .total(new BigDecimal("66.8684971"))
                            .build(),
                        hasFuelConsumptions),
                    getAerVoyage(
                        IMO_NUMBER,
                        PortCountries.GB, PortCodes1.GBAGO.name(), PortCountries.GB, PortCodes1.GBAYW.name(),
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("212.1412412"))
                            .ch4(new BigDecimal("25.1241231"))
                            .n2o(new BigDecimal("44.1245124"))
                            .total(new BigDecimal("512.1241242"))
                            .build(),
                        hasFuelConsumptions),
                    getAerVoyage(
                        IMO_NUMBER,
                        PortCountries.GB, PortCodes1.GBBAN.name(), PortCountries.GB, PortCodes1.GBARD.name(),
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("212.1412412"))
                            .ch4(new BigDecimal("25.1241231"))
                            .n2o(new BigDecimal("44.1245124"))
                            .total(new BigDecimal("512.1241242"))
                            .build(),
                        hasFuelConsumptions),
                    getAerVoyage(
                        IMO_NUMBER,
                        PortCountries.CU, PortCodes1.CUHAV.name(), PortCountries.US, PortCodes2.USBAL.name(),
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("1232.2315231"))
                            .ch4(new BigDecimal("22.1412432"))
                            .n2o(new BigDecimal("41.1512423"))
                            .total(new BigDecimal("65.1241231"))
                            .build(),
                        hasFuelConsumptions),
                    getAerVoyage(
                        IMO_NUMBER,
                        PortCountries.GB, PortCodes1.GBAMD.name(), PortCountries.GR, PortCodes2.GRKAK.name(),
                        AerPortEmissionsMeasurement.builder()
                            .co2(new BigDecimal("1232.2315231"))
                            .ch4(new BigDecimal("22.1412432"))
                            .n2o(new BigDecimal("41.1512423"))
                            .total(new BigDecimal("65.1241231"))
                            .build(),
                        hasFuelConsumptions)
                )
            )
            .build();
    }

    private AerPort getAerPort(String imoNumber, boolean hasFuelConsumptions, AerPortEmissionsMeasurement totalEmissions) {
        return AerPort.builder()
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
            .totalEmissions(totalEmissions)
            .imoNumber(imoNumber)
            .build();
    }

    private AerVoyage getAerVoyage(String imoNumber, PortCountries fromCountry, String fromPort, PortCountries toCountry, String toPort,
                                   AerPortEmissionsMeasurement totalEmissions, boolean hasFuelConsumptions) {
        return AerVoyage.builder()
            .imoNumber(imoNumber)
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
            .voyageDetails(AerVoyageDetails.builder()
                .departurePort(AerPortVisit.builder().country(fromCountry).port(fromPort).build())
                .arrivalPort(AerPortVisit.builder().country(toCountry).port(toPort).build())
                .build())
            .totalEmissions(totalEmissions)
            .build();
    }

    private AerAggregatedData getFetchedAerAggregatedData(boolean addCalculatedValues,
                                                          Set<AerAggregatedDataFuelConsumption> fuelConsumptions) {
        return AerAggregatedData.builder()
            .emissions(new HashSet<>(Set.of(AerShipAggregatedData.builder()
                .imoNumber(IMO_NUMBER)
                .isFromFetch(true)
                .fuelConsumptions(fuelConsumptions)
                .emissionsWithinUKPorts(
                    AerPortEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("94.8055098"))
                        .ch4(new BigDecimal("120.4177984"))
                        .n2o(new BigDecimal("147.7688866"))
                        .total(addCalculatedValues? new BigDecimal("362.9921948"): null)
                        .build()
                )
                .emissionsBetweenUKPorts(
                    AerPortEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("424.2824824"))
                        .ch4(new BigDecimal("50.2482462"))
                        .n2o(new BigDecimal("88.2490248"))
                        .total(addCalculatedValues? new BigDecimal("562.7797534"): null)
                        .build()
                )
                .emissionsBetweenUKAndNIVoyages(
                    AerPortEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("6.3646575"))
                        .ch4(new BigDecimal("58.6470546"))
                        .n2o(new BigDecimal("10.4757946"))
                        .total(addCalculatedValues? new BigDecimal("75.4875067"): null)
                        .build()
                )
                .totalEmissionsFromVoyagesAndPorts(
                    AerPortEmissionsMeasurement
                    .builder()
                    .co2(new BigDecimal("525.4526497"))
                    .ch4(new BigDecimal("229.3130992"))
                    .n2o(new BigDecimal("246.4937060"))
                    .total(addCalculatedValues? new BigDecimal("1001.2594549"): null)
                    .build()
                )
                .lessVoyagesInNorthernIrelandDeduction(
                    AerPortEmissionsMeasurement
                    .builder()
                    .co2(new BigDecimal("522.2703210"))
                    .ch4(new BigDecimal("199.9895719"))
                    .n2o(new BigDecimal("241.2558087"))
                    .total(addCalculatedValues? new BigDecimal("963.5157016"): null)
                    .build()
                )
                .totalShipEmissions(addCalculatedValues? new BigDecimal("1001.2594549"): null)
                .surrenderEmissions(addCalculatedValues? new BigDecimal("963.5157016"): null)
                .build())))
            .build();
    }

    private AerAggregatedData getAerAggregatedData(boolean addCalculatedValues,
                                                   AerPortEmissionsMeasurement totalEmissionsFromVoyagesAndPorts,
                                                   AerPortEmissionsMeasurement lessVoyagesInNorthernIrelandDeduction,
                                                   BigDecimal totalShipEmissions,
                                                   BigDecimal surrenderEmissions,
                                                   Set<AerAggregatedDataFuelConsumption> fuelConsumptions) {
        return AerAggregatedData.builder()
            .emissions(new HashSet<>(Set.of(AerShipAggregatedData.builder()
                .imoNumber(IMO_NUMBER)
                .isFromFetch(false)
                .fuelConsumptions(fuelConsumptions)
                .emissionsWithinUKPorts(
                    AerPortEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("1742.4231535"))
                        .ch4(new BigDecimal("2355.4924821"))
                        .n2o(new BigDecimal("6542.5678901"))
                        .total(addCalculatedValues? new BigDecimal("10640.4835257"): null)
                        .build()
                )
                .emissionsBetweenUKPorts(
                    AerPortEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("239.4444444"))
                        .ch4(new BigDecimal("2342.0000001"))
                        .n2o(new BigDecimal("3456.8765432"))
                        .total(addCalculatedValues? new BigDecimal("6038.3209877"): null)
                        .build()
                )
                .emissionsBetweenUKAndNIVoyages(
                    AerPortEmissionsMeasurement
                        .builder()
                        .co2(new BigDecimal("6.6781234"))
                        .ch4(new BigDecimal("461.9958274"))
                        .n2o(new BigDecimal("2235.7890123"))
                        .total(addCalculatedValues? new BigDecimal("2704.4629631"): null)
                        .build()
                )
                .totalEmissionsFromVoyagesAndPorts(AerPortEmissionsMeasurement
                    .builder()
                    .co2(totalEmissionsFromVoyagesAndPorts.getCo2())
                    .ch4(totalEmissionsFromVoyagesAndPorts.getCh4())
                    .n2o(totalEmissionsFromVoyagesAndPorts.getN2o())
                    .total(addCalculatedValues? totalEmissionsFromVoyagesAndPorts.getTotal(): null)
                    .build())
                .lessVoyagesInNorthernIrelandDeduction(addCalculatedValues? lessVoyagesInNorthernIrelandDeduction: null)
                .totalShipEmissions(addCalculatedValues? totalShipEmissions: null)
                .surrenderEmissions(addCalculatedValues? surrenderEmissions: null)
                .build())))
            .build();
    }

}