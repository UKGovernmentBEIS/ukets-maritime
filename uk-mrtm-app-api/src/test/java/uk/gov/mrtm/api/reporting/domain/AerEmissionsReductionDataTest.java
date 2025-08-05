package uk.gov.mrtm.api.reporting.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortDetails;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortVisit;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageDetails;
import uk.gov.mrtm.api.reporting.enumeration.PortCountries;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

class AerEmissionsReductionDataTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @ParameterizedTest
    @MethodSource("portScenarios")
    void test_aerPortDetails(int violationsSize, boolean isInvalid, AerPortDetails shipDetails, String errorMessage) {
        final Set<ConstraintViolation<AerPortDetails>> violations = validator.validate(shipDetails);

        assertThat(violations.size()).isEqualTo(violationsSize);
        assertEquals(isInvalid, violations.stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains(errorMessage));
    }

    public static Stream<Arguments> portScenarios() {
        LocalDateTime now = LocalDateTime.now();
        AerPortVisit validVisit = AerPortVisit.builder().port("port").country(PortCountries.GB).build();
        AerPortVisit inValidVisit = AerPortVisit.builder().port("port").country(PortCountries.BE).build();

        return Stream.of(
            Arguments.of(1, true, AerPortDetails.builder()
                .visit(inValidVisit)
                .arrivalTime(now)
                .departureTime(now.plusDays(1))
                .build(),
                "{aer.port.details.not.gb.country}"),
            Arguments.of(0, false, AerPortDetails.builder()
                .visit(validVisit)
                .arrivalTime(now)
                .departureTime(now.plusDays(1))
                .build(),
                "{aer.port.details.arrival.and.departure.invalid}"),
            Arguments.of(1, true, AerPortDetails.builder()
                .visit(validVisit)
                .arrivalTime(now)
                .departureTime(now).build(),
                "{aer.port.details.arrival.and.departure.invalid}"),
            Arguments.of(1, true, AerPortDetails.builder()
                .visit(validVisit)
                .arrivalTime(now.plusDays(1)).departureTime(now)
                .build(),
                "{aer.port.details.arrival.and.departure.invalid}")
        );
    }


    @ParameterizedTest
    @MethodSource("voyageScenarios")
    void test_aerVoyageDetails(int violationsSize, boolean isInvalid, AerVoyageDetails shipDetails) {
        final Set<ConstraintViolation<AerVoyageDetails>> violations = validator.validate(shipDetails);

        assertThat(violations.size()).isEqualTo(violationsSize);
        assertEquals(isInvalid, violations.stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("{aer.voyage.details.arrival.and.departure.invalid}"));
    }

    public static Stream<Arguments> voyageScenarios() {
        LocalDateTime now = LocalDateTime.now();
        AerPortVisit validVisit = AerPortVisit.builder().port("port").country(PortCountries.GB).build();

        return Stream.of(
            Arguments.of(0, false,
                AerVoyageDetails.builder()
                    .arrivalPort(validVisit)
                    .departurePort(validVisit)
                    .departureTime(now).arrivalTime(now.plusDays(1))
                    .build()),
            Arguments.of(1, true,
                AerVoyageDetails.builder()
                    .arrivalPort(validVisit)
                    .departurePort(validVisit)
                    .departureTime(now).arrivalTime(now)
                    .build()),
            Arguments.of(1, true,
                AerVoyageDetails.builder()
                    .arrivalPort(validVisit)
                    .departurePort(validVisit)
                    .departureTime(now.plusDays(1)).arrivalTime(now)
                    .build())
        );
    }
}