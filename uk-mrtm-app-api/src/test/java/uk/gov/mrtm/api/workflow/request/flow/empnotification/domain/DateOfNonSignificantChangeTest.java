package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class DateOfNonSignificantChangeTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @ParameterizedTest
    @MethodSource("validDates")
    void validModel(LocalDate startDate, LocalDate endDate) {
        DateOfNonSignificantChange dateOfNonSignificantChange = DateOfNonSignificantChange.builder()
            .startDate(startDate)
            .endDate(endDate)
            .build();

        Set<ConstraintViolation<DateOfNonSignificantChange>> violations =
                validator.validate(dateOfNonSignificantChange);

        assertThat(violations.size()).isZero();
    }

    static Stream<Arguments> validDates() {
        return Stream.of(
                Arguments.of(LocalDate.now(), LocalDate.now().plusDays(1)),
                Arguments.of(null, LocalDate.now()),
                Arguments.of(LocalDate.now(), null)
        );
    }

    @ParameterizedTest
    @MethodSource("inValidDates")
    void invalidModel(LocalDate startDate, LocalDate endDate) {
        DateOfNonSignificantChange dateOfNonSignificantChange = DateOfNonSignificantChange.builder()
            .startDate(startDate)
            .endDate(endDate)
            .build();

        Set<ConstraintViolation<DateOfNonSignificantChange>> violations = validator.validate(dateOfNonSignificantChange);

        assertThat(violations.size()).isEqualTo(1);
        Assertions.assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .containsExactly("{empNotification.endDate.startDate}");
    }

    static Stream<Arguments> inValidDates() {
        LocalDate now = LocalDate.now();

        return Stream.of(
                Arguments.of(now, now),
                Arguments.of(now.plusDays(2), now.plusDays(1))
        );
    }
}
