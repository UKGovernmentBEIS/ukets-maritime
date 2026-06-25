package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PastOrPresentPlusDaysValidatorTest {

    private static final LocalDate TODAY = LocalDate.of(2025, 6, 25);

    private final PastOrPresentPlusDaysValidator validator = new PastOrPresentPlusDaysValidator();

    @Mock
    private ConstraintValidatorContext context;

    @BeforeEach
    void setUp() {
        PastOrPresentPlusDays annotation = mock(PastOrPresentPlusDays.class);
        when(annotation.days()).thenReturn(1);
        validator.initialize(annotation);

        Clock clock = Clock.fixed(TODAY.atStartOfDay(ZoneId.systemDefault()).toInstant(), ZoneId.systemDefault());
        when(context.getClockProvider()).thenReturn(() -> clock);
    }

    @Test
    void pastDateAllowed() {
        assertTrue(validator.isValid(TODAY.minusDays(1), context));
    }

    @Test
    void todayAllowed() {
        assertTrue(validator.isValid(TODAY, context));
    }

    @Test
    void tomorrowAllowed() {
        assertTrue(validator.isValid(TODAY.plusDays(1), context));
    }

    @Test
    void todayPlusTwoRejected() {
        assertFalse(validator.isValid(TODAY.plusDays(2), context));
    }
}
