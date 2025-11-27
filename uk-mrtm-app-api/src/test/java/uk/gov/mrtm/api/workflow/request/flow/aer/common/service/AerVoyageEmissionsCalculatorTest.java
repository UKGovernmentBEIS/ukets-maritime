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
import uk.gov.mrtm.api.reporting.domain.ports.AerPortVisit;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyage;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageDetails;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageEmissions;
import uk.gov.mrtm.api.reporting.enumeration.MeasuringUnit;
import uk.gov.mrtm.api.reporting.enumeration.PortCodes1;
import uk.gov.mrtm.api.reporting.enumeration.PortCodes2;
import uk.gov.mrtm.api.reporting.enumeration.PortCodesNorthernIreland;
import uk.gov.mrtm.api.reporting.enumeration.PortCountries;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerVoyageEmissionsCalculatorTest {
    private static final String IMO_NUMBER = "1234567";

    @InjectMocks
    private AerVoyageEmissionsCalculator validator;

    @ParameterizedTest
    @MethodSource("validScenarios")
    void calculate_Emissions(MeasuringUnit measuringUnit,
                             BigDecimal totalConsumption,
                             FuelOriginTypeName fuelOriginTypeName,
                             AerFuelsAndEmissionsFactors fuelsAndEmissionsFactors,
                             AerPortEmissionsMeasurement surrenderEmissions,
                             AerPortEmissionsMeasurement totalEmissions,
                             AerPortVisit fromPort, AerPortVisit toPort) {
        AerVoyageEmissions voyageEmissions = getVoyageEmissions(false,
            measuringUnit, totalConsumption, fuelOriginTypeName, surrenderEmissions, totalEmissions, fromPort, toPort);

        AerVoyageEmissions expectedVoyageEmissions = getVoyageEmissions(true, measuringUnit,
            totalConsumption, fuelOriginTypeName, surrenderEmissions, totalEmissions, fromPort, toPort);

        AerShipEmissions shipEmissions = AerShipEmissions.builder()
            .details(AerShipDetails
                .builder()
                .imoNumber(IMO_NUMBER)
                .build()
            )
            .fuelsAndEmissionsFactors(Set.of(fuelsAndEmissionsFactors))
            .build();
        AerEmissions emissions = AerEmissions.builder().ships(Set.of(shipEmissions)).build();
        Aer aer = Aer.builder().emissions(emissions).voyageEmissions(voyageEmissions).build();
        Aer expectedAer = Aer.builder().emissions(emissions).voyageEmissions(expectedVoyageEmissions).build();

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
                    .ch4(new BigDecimal("0.0000000"))
                    .co2(new BigDecimal("0.0000000"))
                    .n2o(new BigDecimal("0.0000000"))
                    .total(new BigDecimal("0.0000000"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8219910"))
                    .co2(new BigDecimal("573803.3428361"))
                    .n2o(new BigDecimal("248.7077901"))
                    .total(new BigDecimal("599138.8726172"))
                    .build(),
                AerPortVisit.builder().country(PortCountries.GR).port(PortCodes2.GRKAK.name()).build(),
                AerPortVisit.builder().country(PortCountries.GR).port(PortCodes2.GRPIR.name()).build()
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
                    .ch4(new BigDecimal("25086.8219910"))
                    .co2(new BigDecimal("573803.3428361"))
                    .n2o(new BigDecimal("248.7077901"))
                    .total(new BigDecimal("599138.8726172"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8219910"))
                    .co2(new BigDecimal("573803.3428361"))
                    .n2o(new BigDecimal("248.7077901"))
                    .total(new BigDecimal("599138.8726172"))
                    .build(),
                AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBABD.name()).build(),
                AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBAGO.name()).build()
            ),
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
                    .ch4(new BigDecimal("0.0000000"))
                    .co2(new BigDecimal("0.0000000"))
                    .n2o(new BigDecimal("0.0000000"))
                    .total(new BigDecimal("0.0000000"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8219910"))
                    .co2(new BigDecimal("573803.3428361"))
                    .n2o(new BigDecimal("248.7077901"))
                    .total(new BigDecimal("599138.8726172"))
                    .build(),
                AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBAMR.name()).build(),
                AerPortVisit.builder().country(PortCountries.US).port(PortCodes2.USBAL.name()).build()
            ),
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
                    .ch4(new BigDecimal("0.0000000"))
                    .co2(new BigDecimal("0.0000000"))
                    .n2o(new BigDecimal("0.0000000"))
                    .total(new BigDecimal("0.0000000"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8219910"))
                    .co2(new BigDecimal("573803.3428361"))
                    .n2o(new BigDecimal("248.7077901"))
                    .total(new BigDecimal("599138.8726172"))
                    .build(),
                AerPortVisit.builder().country(PortCountries.US).port(PortCodes2.USBAL.name()).build(),
                AerPortVisit.builder().country(PortCountries.GR).port(PortCodes2.GRKAK.name()).build()
            ),
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
                    .ch4(new BigDecimal("0.0000000"))
                    .co2(new BigDecimal("0.0000000"))
                    .n2o(new BigDecimal("0.0000000"))
                    .total(new BigDecimal("0.0000000"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8219910"))
                    .co2(new BigDecimal("573803.3428361"))
                    .n2o(new BigDecimal("248.7077901"))
                    .total(new BigDecimal("599138.8726172"))
                    .build(),
                AerPortVisit.builder().country(PortCountries.US).port(PortCodes2.USBAL.name()).build(),
                AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBAMR.name()).build()
            ),
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
                    .ch4(new BigDecimal("0.0000000"))
                    .co2(new BigDecimal("0.0000000"))
                    .n2o(new BigDecimal("0.0000000"))
                    .total(new BigDecimal("0.0000000"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8219910"))
                    .co2(new BigDecimal("573803.3428361"))
                    .n2o(new BigDecimal("248.7077901"))
                    .total(new BigDecimal("599138.8726172"))
                    .build(),
                AerPortVisit.builder().country(PortCountries.US).port(PortCodes2.USBAL.name()).build(),
                AerPortVisit.builder().country(PortCountries.MA).port(PortCodes2.MAANZ.name()).build()
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
                    .ch4(new BigDecimal("12543.4109955"))
                    .co2(new BigDecimal("286901.6714181"))
                    .n2o(new BigDecimal("124.3538951"))
                    .total(new BigDecimal("299569.4363087"))
                    .build(),
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("25086.8219910"))
                    .co2(new BigDecimal("573803.3428361"))
                    .n2o(new BigDecimal("248.7077901"))
                    .total(new BigDecimal("599138.8726172"))
                    .build(),
                AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBAGO.name()).build(),
                AerPortVisit.builder().country(PortCountries.GR).port(PortCodesNorthernIreland.GBBEL.name()).build()
            )
        );
    }

    private AerVoyageEmissions getVoyageEmissions(boolean addCalculatedValues,
                                                  MeasuringUnit measuringUnit,
                                                  BigDecimal totalConsumption,
                                                  FuelOriginTypeName fuelOriginTypeName,
                                                  AerPortEmissionsMeasurement surrenderEmissions,
                                                  AerPortEmissionsMeasurement totalEmissions,
                                                  AerPortVisit fromPort, AerPortVisit toPort) {

        AerVoyageDetails voyageDetails = AerVoyageDetails
            .builder()
            .arrivalPort(toPort)
            .departurePort(fromPort)
            .build();

        AerFuelConsumption fuelConsumption = AerFuelConsumption
            .builder()
            .fuelOriginTypeName(fuelOriginTypeName)
            .amount(new BigDecimal("1.12345"))
            .measuringUnit(measuringUnit)
            .fuelDensity(new BigDecimal("10.456"))
            .totalConsumption(addCalculatedValues? totalConsumption: null)
            .build();

        AerVoyage voyage = AerVoyage.builder()
            .imoNumber(IMO_NUMBER)
            .voyageDetails(voyageDetails)
            .directEmissions(
                AerPortEmissionsMeasurement.builder()
                    .ch4(new BigDecimal("1.1234231"))
                    .co2(new BigDecimal("422.4233321"))
                    .n2o(new BigDecimal("0.9854233"))
                    .total(addCalculatedValues? new BigDecimal("424.5321785"): null)
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

        return AerVoyageEmissions.builder().voyages(Set.of(voyage)).build();
    }
}