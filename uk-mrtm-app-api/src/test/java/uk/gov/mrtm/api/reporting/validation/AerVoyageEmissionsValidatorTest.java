package uk.gov.mrtm.api.reporting.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmissionsSources;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerDerogations;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortVisit;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyage;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageDetails;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageEmissions;
import uk.gov.mrtm.api.reporting.enumeration.PortCodes1;
import uk.gov.mrtm.api.reporting.enumeration.PortCountries;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.ARRIVAL_YEAR_MISMATCH_AER_YEAR;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.CCS_CCU_INVALID_VALUE;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.DEPARTURE_YEAR_MISMATCH_AER_YEAR;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.NEGATIVE_EMISSIONS_INPUT;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.NO_DIRECT_EMISSIONS_OR_FUEL_CONSUMPTIONS;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.OVERLAPPING_VOYAGES_FOUND;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.PORTS_FUEL_CONSUMPTION_METHANE_SLIP_OR_NAME_MISMATCH;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.PORT_VISIT_INVALID_PORT_CODE;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.PORT_VISIT_INVALID_PORT_COUNTRY;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.SHIP_NOT_FOUND_IN_LIST_OF_SHIPS;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.SMALL_ISLAND_FERRY_OPERATOR_INVALID_VALUE;

@ExtendWith(MockitoExtension.class)
class AerVoyageEmissionsValidatorTest {

    private static final long ACCOUNT_ID = 1L;
    private static final String IMO_NUMBER = "1234567";
    private static final LocalDateTime NOW = LocalDateTime.now();

    @InjectMocks
    private AerVoyageEmissionsValidator validator;

    @Test
    void validate_is_valid() {
        AerVoyage voyage = createVoyage(true, PortCodes1.NOT_APPLICABLE.name(), PortCountries.BE,
            NOW, NOW.plusDays(1), null, null, true, null, null, null);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), IMO_NUMBER,
            false, true, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertTrue(result.isValid());
        assertThat(result.getAerViolations()).isEmpty();
    }

    @Test
    void validate_ship_not_found_in_list_of_ships() {
        AerVoyage voyage = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW, NOW.plusDays(1), null, null, true, null, null, null);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), "7654321",
            false, true, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(SHIP_NOT_FOUND_IN_LIST_OF_SHIPS.getMessage()));
    }

    @Test
    void validate_no_direct_emissions_or_fuel_consumptions() {
        AerVoyage voyage = createVoyage(false, PortCodes1.BE888.name(), PortCountries.BE,
            NOW, NOW.plusDays(1), null, null, true, null, null, null);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), IMO_NUMBER,
            false, true, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(NO_DIRECT_EMISSIONS_OR_FUEL_CONSUMPTIONS.getMessage()));
    }

    @ParameterizedTest
    @MethodSource("negativeEmissionsMeasurementScenarios")
    void validate_negative_emissions_input(AerPortEmissionsMeasurement directEmissions) {
        AerVoyage voyage = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW, NOW.plusDays(1), null, null, true, null, null, directEmissions);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), IMO_NUMBER,
            false, true, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations().size()).isEqualTo(1);
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(NEGATIVE_EMISSIONS_INPUT.getMessage()));
    }

    public static Stream<AerPortEmissionsMeasurement> negativeEmissionsMeasurementScenarios() {
        return Stream.of(
            AerPortEmissionsMeasurement.builder()
                .co2(new BigDecimal("-1"))
                .ch4(new BigDecimal("2"))
                .n2o(new BigDecimal("3"))
                .total(new BigDecimal("4"))
                .build(),
            AerPortEmissionsMeasurement.builder()
                .co2(new BigDecimal("1"))
                .ch4(new BigDecimal("-2"))
                .n2o(new BigDecimal("3"))
                .total(new BigDecimal("2"))
                .build(),
            AerPortEmissionsMeasurement.builder()
                .co2(new BigDecimal("1"))
                .ch4(new BigDecimal("2"))
                .n2o(new BigDecimal("-3"))
                .total(new BigDecimal("0"))
                .build(),
            AerPortEmissionsMeasurement.builder()
                .co2(new BigDecimal("-1"))
                .ch4(new BigDecimal("-2"))
                .n2o(new BigDecimal("-3"))
                .total(new BigDecimal("-6"))
                .build()
        );
    }

    @Test
    void validate_port_visit_invalid_port_code() {
        AerVoyage voyage = createVoyage(true, "INVALID_PORT_CODE", PortCountries.GR,
            NOW, NOW.plusDays(1), null, null, true, null, null, null);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), IMO_NUMBER,
            false, true, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations().size()).isEqualTo(2);
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(PORT_VISIT_INVALID_PORT_CODE.getMessage()));
    }

    @Test
    void validate_port_visit_invalid_port_country() {
        AerVoyage voyage = createVoyage(true, PortCodes1.BE888.name(), PortCountries.GR,
            NOW, NOW.plusDays(1), null, null, true, null, null, null);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), IMO_NUMBER,
            false, true, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations().size()).isEqualTo(2);
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(PORT_VISIT_INVALID_PORT_COUNTRY.getMessage()));
    }

    @Test
    void validate_arrival_year_mismatch_aer_year() {
        AerVoyage voyage = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW.plusDays(1), NOW.plusYears(1), null, null, true, null, null, null);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), IMO_NUMBER,
            false, true, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(ARRIVAL_YEAR_MISMATCH_AER_YEAR.getMessage()));
    }

    @Test
    void validate_departure_year_mismatch_aer_year() {
        AerVoyage voyage = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW.plusYears(1), NOW, null, null, true, null, null, null);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), IMO_NUMBER,
            false, true, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(DEPARTURE_YEAR_MISMATCH_AER_YEAR.getMessage()));
    }

    @ParameterizedTest
    @MethodSource("validateCcsCcuInvalidScenarios")
    void validate_ccs_ccu_invalid_value(boolean hasCarbonCapture, BigDecimal ccs, BigDecimal ccu) {
        AerVoyage voyage = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW, NOW.plusDays(1), ccs, ccu, true, null, null, null);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), IMO_NUMBER,
            hasCarbonCapture, true, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(CCS_CCU_INVALID_VALUE.getMessage()));
    }

    static Stream<Arguments> validateCcsCcuInvalidScenarios() {
        return Stream.of(
            Arguments.of(false, new BigDecimal("1"), new BigDecimal("1")),
            Arguments.of(false, null, new BigDecimal("1")),
            Arguments.of(false, new BigDecimal("1"), null),
            Arguments.of(true, null, null),
            Arguments.of(true, new BigDecimal("1"), null),
            Arguments.of(true, null, new BigDecimal("1"))
        );
    }

    @ParameterizedTest
    @MethodSource("validateSmallIslandFerryInvalidScenarios")
    void validate_small_island_ferry_operator_invalid_value(Boolean smallIslandFerryReduction,
                                                            Boolean smallIslandFerryOperatorReduction) {
        AerVoyage voyage = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW, NOW.plusDays(1), null, null, smallIslandFerryReduction, null, null, null);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), IMO_NUMBER,
            false, smallIslandFerryOperatorReduction, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(SMALL_ISLAND_FERRY_OPERATOR_INVALID_VALUE.getMessage()));
    }

    static Stream<Arguments> validateSmallIslandFerryInvalidScenarios() {
        return Stream.of(
            Arguments.of(false, false),
            Arguments.of(true, false),
            Arguments.of(null, true)
        );
    }

    @ParameterizedTest
    @MethodSource("validatePortsFuelConsumptionTypeDoesNotExistScenarios")
    void validate_ports_fuel_consumption_type_does_not_exist(String fuelConsumptionName, String emissionSourcesName,
                                                             BigDecimal fuelConsumptionMethaneSlip, BigDecimal emissionSourcesMethaneSlip,
                                                             FossilFuelType fossilFuelType) {
        AerVoyage voyage = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW, NOW.plusDays(1), null, null, true, fuelConsumptionName, fuelConsumptionMethaneSlip, null);
        AerContainer aerContainer = getAerContainer(Set.of(voyage), IMO_NUMBER,
            false, true, fossilFuelType, emissionSourcesName, emissionSourcesMethaneSlip);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(PORTS_FUEL_CONSUMPTION_METHANE_SLIP_OR_NAME_MISMATCH.getMessage()));
    }

    static Stream<Arguments> validatePortsFuelConsumptionTypeDoesNotExistScenarios() {
        return Stream.of(
            Arguments.of("1", "2", new BigDecimal("1"), new BigDecimal("1"), FossilFuelType.H2),
            Arguments.of(null, "2", new BigDecimal("1"), new BigDecimal("2"), FossilFuelType.H2),
            Arguments.of("1", "1", new BigDecimal("1"), null, FossilFuelType.H2),
            Arguments.of("1", "1", null, new BigDecimal("1"), FossilFuelType.H2),
            Arguments.of("1", "1", new BigDecimal("1"), new BigDecimal("2"), FossilFuelType.H2),
            Arguments.of("1", "1", new BigDecimal("1"), new BigDecimal("1"), FossilFuelType.MDO),
            Arguments.of(null, "1", new BigDecimal("1"), new BigDecimal("1"), FossilFuelType.MDO)
        );
    }

    @Test
    void validate_overlapping_voyages_found() {
        AerVoyage voyage1 = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW, NOW.plusDays(2), null, null, true, null, null, null);

        AerVoyage voyage3 = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW.plusDays(1), NOW.plusDays(3), null, null, true, null, null, null);

        AerVoyage voyage2 = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW.plusDays(3), NOW.plusDays(4), null, null, true, null, null, null);

        AerVoyage voyage4 = createVoyage(true, PortCodes1.BE888.name(), PortCountries.BE,
            NOW.plusDays(3).minusSeconds(1), NOW.plusDays(5), null, null, true, null, null, null);

        AerContainer aerContainer = getAerContainer(Set.of(voyage1, voyage2, voyage3, voyage4), IMO_NUMBER,
            false, true, FossilFuelType.H2, null, null);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations().size()).isEqualTo(3);
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(OVERLAPPING_VOYAGES_FOUND.getMessage()));
    }

    private AerContainer getAerContainer(Set<AerVoyage> voyages, String emissionsImoNumber,
                                         boolean hasCarbonCapture,
                                         Boolean smallIslandFerryOperatorReduction,
                                         FossilFuelType listOfShipsFuelType,
                                         String emissionSourcesName,
                                         BigDecimal emissionSourcesMethaneSlip) {
        return AerContainer
            .builder()
            .reportingYear(Year.of(NOW.getYear()))
            .aer(
                Aer.builder()
                    .voyageEmissions(AerVoyageEmissions
                        .builder()
                        .voyages(voyages)
                        .build()
                    )
                    .emissions(
                        AerEmissions.builder()
                            .ships(
                                Set.of(
                                    AerShipEmissions.builder()
                                        .uniqueIdentifier(UUID.randomUUID())
                                        .details(
                                            AerShipDetails.builder()
                                                .imoNumber(emissionsImoNumber)
                                                .build()
                                        )
                                        .derogations(AerDerogations.builder()
                                            .carbonCaptureAndStorageReduction(hasCarbonCapture)
                                            .smallIslandFerryOperatorReduction(smallIslandFerryOperatorReduction)
                                            .build()
                                        )
                                        .emissionsSources(
                                            Set.of(
                                                EmissionsSources.builder()
                                                    .name(emissionSourcesName)
                                                    .fuelDetails(
                                                        Set.of(
                                                            FuelOriginBiofuelTypeName.builder()
                                                                .origin(FuelOrigin.BIOFUEL)
                                                                .type(BioFuelType.ETHANOL)
                                                                .methaneSlip(new BigDecimal("99"))
                                                                .uniqueIdentifier(UUID.randomUUID())
                                                                .build(),
                                                            FuelOriginFossilTypeName.builder()
                                                                .origin(FuelOrigin.FOSSIL)
                                                                .type(listOfShipsFuelType)
                                                                .methaneSlip(emissionSourcesMethaneSlip)
                                                                .uniqueIdentifier(UUID.randomUUID())
                                                                .build()
                                                        )
                                                    )
                                                    .build()
                                            )
                                        )
                                        .build()
                                )
                            )
                            .build()
                    )
                    .build()
            )
            .build();
    }

    private AerVoyage createVoyage(boolean hasFuelConsumptions, String portCode,
                                   PortCountries portCountry, LocalDateTime departureTime, LocalDateTime arrivalTime,
                                   BigDecimal ccs, BigDecimal ccu,
                                   Boolean smallIslandFerryReduction,
                                   String fuelConsumptionName,
                                   BigDecimal fuelConsumptionMethaneSlip,
                                   AerPortEmissionsMeasurement directEmissions) {

        return AerVoyage.builder()
            .uniqueIdentifier(UUID.randomUUID())
            .imoNumber(IMO_NUMBER)
            .voyageDetails(
                AerVoyageDetails
                    .builder()
                    .arrivalPort(
                        AerPortVisit.builder()
                            .port(portCode)
                            .country(portCountry)
                            .build()
                    )
                    .departurePort(
                        AerPortVisit.builder()
                            .port(portCode)
                            .country(portCountry)
                            .build()
                    )
                    .ccu(ccu)
                    .ccs(ccs)
                    .smallIslandFerryReduction(smallIslandFerryReduction)
                    .arrivalTime(arrivalTime)
                    .departureTime(departureTime)
                    .build()
            )
            .directEmissions(directEmissions)
            .fuelConsumptions(hasFuelConsumptions ?
                Set.of(
                    AerFuelConsumption.builder()
                        .fuelOriginTypeName(
                            FuelOriginFossilTypeName.builder()
                                .origin(FuelOrigin.FOSSIL)
                                .type(FossilFuelType.H2)
                                .methaneSlip(fuelConsumptionMethaneSlip)
                                .uniqueIdentifier(UUID.randomUUID())
                                .build()
                        )
                        .name(fuelConsumptionName)
                        .build()
                ) : new HashSet<>())
            .build();
    }

}