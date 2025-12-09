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
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil.AerFossilFuels;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfDetails;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfPurchase;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.INVALID_FUEL_CONSUMPTION;

@ExtendWith(MockitoExtension.class)
class AerSmfValidatorTest {
    private static final long ACCOUNT_ID = 1L;

    @InjectMocks
    private AerSmfValidator validator;

    @ParameterizedTest
    @ValueSource(booleans = {true, false})
    void validate_is_valid(boolean exist) {
        List<AerSmfPurchase> aerSmfPurchases = getAerSmfPurchases();
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors = getAerFuelsAndEmissionsFactors();
        AerContainer aerContainer = getAerContainer(exist, aerSmfPurchases, fuelsAndEmissionsFactors);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertTrue(result.isValid());
        assertThat(result.getAerViolations()).isEmpty();
    }

    @ParameterizedTest
    @MethodSource("invalidFuelConsumptionScenarios")
    void validate_invalid_fuel_consumption(List<AerSmfPurchase> aerSmfPurchases,
                                           Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors) {
        AerContainer aerContainer = getAerContainer(true, aerSmfPurchases, fuelsAndEmissionsFactors);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(INVALID_FUEL_CONSUMPTION.getMessage()));
        assertThat(result.getAerViolations()).extracting(AerViolation::getData)
            .containsExactlyInAnyOrder(Set.of(FossilFuelType.METHANOL.name()).toArray());
    }

    public static Stream<Arguments> invalidFuelConsumptionScenarios() {
        AerFuelOriginFossilTypeName methanol = AerFuelOriginFossilTypeName.builder()
            .origin(FuelOrigin.FOSSIL)
            .type(FossilFuelType.METHANOL)
            .uniqueIdentifier(UUID.randomUUID())
            .build();

        AerFossilFuels h2 = AerFossilFuels.builder()
            .origin(FuelOrigin.FOSSIL)
            .type(FossilFuelType.H2)
            .uniqueIdentifier(UUID.randomUUID())
            .build();

        List<AerSmfPurchase> aerSmfPurchases1 = List.of(
            AerSmfPurchase.builder()
                .fuelOriginTypeName(
                    AerFuelOriginFossilTypeName.builder()
                        .origin(FuelOrigin.FOSSIL)
                        .type(FossilFuelType.H2)
                        .uniqueIdentifier(UUID.randomUUID())
                        .build()
                )
                .build(),
            AerSmfPurchase.builder()
                .fuelOriginTypeName(methanol)
                .build()
        );
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors1 = Set.of(h2);

        List<AerSmfPurchase> aerSmfPurchases2 = List.of(
            AerSmfPurchase.builder()
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
        AerSmfPurchase smfPurchase = AerSmfPurchase.builder()
            .fuelOriginTypeName(
                AerFuelOriginFossilTypeName.builder()
                    .origin(FuelOrigin.FOSSIL)
                    .uniqueIdentifier(UUID.randomUUID())
                    .type(FossilFuelType.H2)
                    .build()
            )
            .build();

        List<AerSmfPurchase> aerSmfPurchases = List.of(smfPurchase, smfPurchase);
        Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors = getAerFuelsAndEmissionsFactors();
        AerContainer aerContainer = getAerContainer(true, aerSmfPurchases, fuelsAndEmissionsFactors);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertTrue(result.isValid());
        assertThat(result.getAerViolations()).isEmpty();
    }

    private AerContainer getAerContainer(boolean exist, List<AerSmfPurchase> aerSmfPurchases,
                                         Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors) {
        return AerContainer.builder()
            .aer(
                Aer.builder()
                    .smf(
                        AerSmf
                            .builder()
                            .exist(exist)
                            .smfDetails(
                                AerSmfDetails.builder()
                                    .purchases(
                                        aerSmfPurchases
                                    )
                                    .build()
                            )
                            .build()
                    )
                    .emissions(
                        AerEmissions.builder()
                            .ships(
                                Set.of(
                                    AerShipEmissions.builder()
                                        .fuelsAndEmissionsFactors(
                                            fuelsAndEmissionsFactors
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

    private static Set<AerFuelsAndEmissionsFactors> getAerFuelsAndEmissionsFactors() {
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

    private List<AerSmfPurchase> getAerSmfPurchases() {
        return List.of(
            AerSmfPurchase.builder()
                .fuelOriginTypeName(
                    AerFuelOriginFossilTypeName.builder()
                        .origin(FuelOrigin.FOSSIL)
                        .uniqueIdentifier(UUID.randomUUID())
                        .type(FossilFuelType.H2)
                        .build()
                )
                .build()
        );
    }
}