package uk.gov.mrtm.api.reporting.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;

import java.time.LocalDate;
import java.time.Year;
import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.SHIP_DETAILS_INVALID_YEAR;

@ExtendWith(MockitoExtension.class)
class AerShipDetailsValidatorTest {
    private static final long ACCOUNT_ID = 1L;
    private static final LocalDate NOW = LocalDate.now();

    @InjectMocks
    private AerShipDetailsValidator validator;

    @Test
    void validate_is_valid() {
        AerContainer aerContainer = getAerContainer(NOW, NOW);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertTrue(result.isValid());
        assertThat(result.getAerViolations()).isEmpty();
    }

    @ParameterizedTest
    @MethodSource("validateCcsCcuInvalidScenarios")
    void validate_is_invalid(LocalDate from, LocalDate to) {
        AerContainer aerContainer = getAerContainer(from, to);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations().size()).isEqualTo(1);
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(SHIP_DETAILS_INVALID_YEAR.getMessage()));
    }

    public static Stream<Arguments> validateCcsCcuInvalidScenarios() {
        return Stream.of(
            Arguments.of(NOW.plusYears(1), NOW),
            Arguments.of(NOW, NOW.plusYears(1)),
            Arguments.of(NOW.plusYears(1), NOW.plusYears(1))
        );
    }

    private AerContainer getAerContainer(LocalDate from, LocalDate to) {
        return AerContainer.builder()
            .reportingYear(Year.of(NOW.getYear()))
            .aer(
                Aer.builder()
                    .emissions(
                        AerEmissions.builder()
                            .ships(
                                Set.of(
                                    AerShipEmissions.builder()
                                        .details(
                                            AerShipDetails.builder()
                                                .from(from)
                                                .to(to)
                                                .build()
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
}