package uk.gov.mrtm.api.reporting.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.AerFuelOriginFossilTypeName;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.emissions.AerDerogations;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil.AerFossilFuels;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortEmissions;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyage;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageEmissions;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.AGGREGATED_DATA_FETCHED_SHIP_NOT_FOUND_IN_PORTS_OR_VOYAGES;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.AGGREGATED_DATA_INVALID_SMALL_ISLAND_FERRY_EMISSIONS;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.DUPLICATE_FUEL_ENTRIES;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.INVALID_FUEL_CONSUMPTION;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.NEGATIVE_EMISSIONS_INPUT;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.SHIP_NOT_FOUND_IN_LIST_OF_SHIPS;

@ExtendWith(MockitoExtension.class)
class AerShipAggregatedDataValidatorTest {
    private static final String IMO_NUMBER = "1234567";
    private static final long ACCOUNT_ID = 1L;

    @InjectMocks
    private AerShipAggregatedDataValidator validator;

    @ParameterizedTest
    @MethodSource("validScenarios")
    void validate_is_valid(boolean isFromFetch, boolean hasPorts, boolean hasVoyages) {
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors = getAerFuelsAndEmissionsFactors();
        AerAggregatedEmissionsMeasurement emissionsMeasurement = getAerAggregatedEmissionsMeasurement();
        AerContainer aerContainer = getAerContainer(IMO_NUMBER,
            fuelsAndEmissionsFactors, new HashSet<>(), false, false, hasPorts, hasVoyages, isFromFetch, emissionsMeasurement);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertTrue(result.isValid());
        assertThat(result.getAerViolations()).isEmpty();
    }

    public static Stream<Arguments> validScenarios() {
        return Stream.of(
            Arguments.of(true, false, true),
            Arguments.of(true, true, false),
            Arguments.of(true, true, true),
            Arguments.of(false, true, true),
            Arguments.of(false, true, false),
            Arguments.of(false, true, true),
            Arguments.of(false, false, false)
        );
    }

    @Test
    void validate_ship_not_found_in_list_of_ships() {
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors = getAerFuelsAndEmissionsFactors();
        AerAggregatedEmissionsMeasurement emissionsMeasurement = getAerAggregatedEmissionsMeasurement();
        AerContainer aerContainer = getAerContainer("7654321",
            fuelsAndEmissionsFactors, new HashSet<>(), false, false, true, true, false, emissionsMeasurement);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(SHIP_NOT_FOUND_IN_LIST_OF_SHIPS.getMessage()));
    }

    @ParameterizedTest
    @MethodSource("negativeEmissionsMeasurementScenarios")
    void validate_negative_emissions_input(AerAggregatedEmissionsMeasurement emissionsMeasurement) {
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors = getAerFuelsAndEmissionsFactors();
        AerContainer aerContainer = getAerContainer(IMO_NUMBER,
            fuelsAndEmissionsFactors, new HashSet<>(), true, true, true, true, false, emissionsMeasurement);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).hasSize(4);
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(NEGATIVE_EMISSIONS_INPUT.getMessage()));
    }

    public static Stream<AerAggregatedEmissionsMeasurement> negativeEmissionsMeasurementScenarios() {
        return Stream.of(
            AerAggregatedEmissionsMeasurement.builder()
                .co2(new BigDecimal("-1"))
                .ch4(new BigDecimal("2"))
                .n2o(new BigDecimal("3"))
                .co2Captured(new BigDecimal("4"))
                .total(new BigDecimal("8"))
                .build(),
            AerAggregatedEmissionsMeasurement.builder()
                .co2(new BigDecimal("1"))
                .ch4(new BigDecimal("-2"))
                .n2o(new BigDecimal("3"))
                .co2Captured(new BigDecimal("4"))
                .total(new BigDecimal("6"))
                .build(),
            AerAggregatedEmissionsMeasurement.builder()
                .co2(new BigDecimal("1"))
                .ch4(new BigDecimal("2"))
                .n2o(new BigDecimal("-3"))
                .co2Captured(new BigDecimal("4"))
                .total(new BigDecimal("4"))
                .build(),
            AerAggregatedEmissionsMeasurement.builder()
                .co2(new BigDecimal("1"))
                .ch4(new BigDecimal("2"))
                .n2o(new BigDecimal("3"))
                .co2Captured(new BigDecimal("-4"))
                .total(new BigDecimal("2"))
                .build(),
            AerAggregatedEmissionsMeasurement.builder()
                .co2(new BigDecimal("-1"))
                .ch4(new BigDecimal("-2"))
                .n2o(new BigDecimal("-3"))
                .co2Captured(new BigDecimal("-4"))
                .total(new BigDecimal("-10"))
                .build()
        );
    }

    @Test
    void validate_aggregated_data_fetched_ship_not_found_in_ports_or_voyages() {
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors = getAerFuelsAndEmissionsFactors();
        AerAggregatedEmissionsMeasurement emissionsMeasurement = getAerAggregatedEmissionsMeasurement();
        AerContainer aerContainer = getAerContainer(IMO_NUMBER,
            fuelsAndEmissionsFactors, new HashSet<>(), false, false, false, false, true, emissionsMeasurement);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(AGGREGATED_DATA_FETCHED_SHIP_NOT_FOUND_IN_PORTS_OR_VOYAGES.getMessage()));
    }

    @ParameterizedTest
    @ValueSource(booleans = {true, false})
    void validate_aggregated_data_invalid_small_island_ferry_emissions(boolean hasSmallIslandSurrenderReduction) {
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors = getAerFuelsAndEmissionsFactors();
        AerAggregatedEmissionsMeasurement emissionsMeasurement = getAerAggregatedEmissionsMeasurement();
        AerContainer aerContainer = getAerContainer(IMO_NUMBER, fuelsAndEmissionsFactors,
            new HashSet<>(), !hasSmallIslandSurrenderReduction, hasSmallIslandSurrenderReduction, true, true, false, emissionsMeasurement);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(AGGREGATED_DATA_INVALID_SMALL_ISLAND_FERRY_EMISSIONS.getMessage()));
    }

    @ParameterizedTest
    @MethodSource("invalidFuelConsumptionScenarios")
    void validate_invalid_fuel_consumption(Set<AerAggregatedDataFuelConsumption> fuelConsumptions,
                                           Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors) {
        AerAggregatedEmissionsMeasurement emissionsMeasurement = getAerAggregatedEmissionsMeasurement();
        AerContainer aerContainer = getAerContainer(IMO_NUMBER,
            fuelsAndEmissionsFactors, fuelConsumptions, true, true, true, true, false, emissionsMeasurement);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(INVALID_FUEL_CONSUMPTION.getMessage()));
    }

    public static Stream<Arguments> invalidFuelConsumptionScenarios() {
        AerFuelOriginFossilTypeName methanol = AerFuelOriginFossilTypeName.builder()
            .uniqueIdentifier(UUID.randomUUID())
            .origin(FuelOrigin.FOSSIL)
            .type(FossilFuelType.METHANOL)
            .build();

        AerFossilFuels h2 = AerFossilFuels.builder()
            .origin(FuelOrigin.FOSSIL)
            .type(FossilFuelType.H2)
            .uniqueIdentifier(UUID.randomUUID())
            .build();

        Set<AerAggregatedDataFuelConsumption> aerSmfPurchases1 = Set.of(
            AerAggregatedDataFuelConsumption.builder()
                .fuelOriginTypeName(
                    AerFuelOriginFossilTypeName.builder()
                        .origin(FuelOrigin.FOSSIL)
                        .type(FossilFuelType.H2)
                        .uniqueIdentifier(UUID.randomUUID())
                        .build()
                )
                .build(),
            AerAggregatedDataFuelConsumption.builder()
                .fuelOriginTypeName(methanol)
                .build()
        );
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors1 = Set.of(h2);

        Set<AerAggregatedDataFuelConsumption> aerSmfPurchases2 = Set.of(
            AerAggregatedDataFuelConsumption.builder()
                .fuelOriginTypeName(methanol)
                .build()
        );
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors2 = Set.of(h2);

        return Stream.of(
            Arguments.of(aerSmfPurchases1, fuelsAndEmissionsFactors1),
            Arguments.of(aerSmfPurchases2, fuelsAndEmissionsFactors2)
        );
    }

    @Test
    void validate_duplicate_fuel_consumption() {
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors = getAerFuelsAndEmissionsFactors();
        AerAggregatedDataFuelConsumption aerAggregatedDataFuelConsumption1 = AerAggregatedDataFuelConsumption.builder()
            .fuelOriginTypeName(AerFuelOriginFossilTypeName.builder()
                .origin(FuelOrigin.FOSSIL)
                .type(FossilFuelType.H2)
                .uniqueIdentifier(UUID.randomUUID())
                .build())
            .totalConsumption(new BigDecimal("1"))
            .build();
        AerAggregatedDataFuelConsumption aerAggregatedDataFuelConsumption2 = AerAggregatedDataFuelConsumption.builder()
            .fuelOriginTypeName(AerFuelOriginFossilTypeName.builder()
                .origin(FuelOrigin.FOSSIL)
                .type(FossilFuelType.H2)
                .uniqueIdentifier(UUID.randomUUID())
                .build())
            .totalConsumption(new BigDecimal("2"))
            .build();

        Set<AerAggregatedDataFuelConsumption> fuelConsumptions = Set.of(
            aerAggregatedDataFuelConsumption1, aerAggregatedDataFuelConsumption2
        );

        AerAggregatedEmissionsMeasurement emissionsMeasurement = getAerAggregatedEmissionsMeasurement();
        AerContainer aerContainer = getAerContainer(IMO_NUMBER,
            fuelsAndEmissionsFactors, fuelConsumptions, true, true, true, true, false, emissionsMeasurement);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(DUPLICATE_FUEL_ENTRIES.getMessage()));
    }

    private AerContainer getAerContainer(String emissionsImoNumber,
                                         Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors,
                                         Set<AerAggregatedDataFuelConsumption> fuelConsumptions,
                                         Boolean smallIslandFerryOperatorReduction,
                                         boolean hasSmallIslandSurrenderReduction,
                                         boolean hasPorts,
                                         boolean hasVoyages,
                                         boolean isFromFetch,
                                         AerAggregatedEmissionsMeasurement emissionsMeasurement) {
        return AerContainer
            .builder()
            .aer(
                Aer.builder()
                    .aggregatedData(
                        AerAggregatedData.builder()
                            .emissions(
                                Set.of(
                                    AerShipAggregatedData.builder()
                                        .imoNumber(IMO_NUMBER)
                                        .isFromFetch(isFromFetch)
                                        .fuelConsumptions(fuelConsumptions)
                                        .emissionsBetweenUKAndEEAVoyages(emissionsMeasurement)
                                        .emissionsBetweenUKPorts(emissionsMeasurement)
                                        .emissionsWithinUKPorts(emissionsMeasurement)
                                        .smallIslandSurrenderReduction(hasSmallIslandSurrenderReduction
                                            ? emissionsMeasurement
                                            : null)
                                        .build()
                                )
                            )
                            .build()
                    )
                    .portEmissions(
                        AerPortEmissions.builder()
                            .ports(hasPorts ? Set.of(AerPort.builder().imoNumber(IMO_NUMBER).build()): new HashSet<>())
                            .build()
                    )
                    .voyageEmissions(
                        AerVoyageEmissions.builder()
                            .voyages(hasVoyages ? Set.of(AerVoyage.builder().imoNumber(IMO_NUMBER).build()): new HashSet<>())
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
                                            .smallIslandFerryOperatorReduction(smallIslandFerryOperatorReduction)
                                            .build()
                                        )
                                        .fuelsAndEmissionsFactors(fuelsAndEmissionsFactors)
                                        .build()
                                )
                            )
                            .build()
                    )
                    .build()
            )
            .build();
    }

    private Set<AerFuelsAndEmissionsFactors> getAerFuelsAndEmissionsFactors() {
        return Set.of(
            AerFossilFuels.builder()
                .origin(FuelOrigin.FOSSIL)
                .type(FossilFuelType.H2)
                .uniqueIdentifier(UUID.randomUUID())
                .build(),
            AerFossilFuels.builder()
                .origin(FuelOrigin.FOSSIL)
                .uniqueIdentifier(UUID.randomUUID())
                .type(FossilFuelType.MDO)
                .build()
        );
    }


    private AerAggregatedEmissionsMeasurement getAerAggregatedEmissionsMeasurement() {
        return AerAggregatedEmissionsMeasurement.builder()
            .co2(new BigDecimal("1"))
            .ch4(new BigDecimal("2"))
            .n2o(new BigDecimal("3"))
            .co2Captured(new BigDecimal("4"))
            .total(new BigDecimal("10"))
            .build();
    }
}