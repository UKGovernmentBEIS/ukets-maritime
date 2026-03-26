package uk.gov.mrtm.api.integration.external.verification.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import uk.gov.mrtm.api.reporting.domain.verification.AerSiteVisitType;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ExternalAerSiteVisitTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void valid_IN_PERSON() {
        final ExternalAerSiteVisit siteVisit = ExternalAerSiteVisit.builder()
            .type(AerSiteVisitType.IN_PERSON)
            .siteVisitDetails(List.of(ExternalAerInPersonSiteVisitDatesDetails.builder().numberOfDays(1).startDate(LocalDate.now()).build()))
            .teamMembers("teamMembers")
            .build();

        final Set<ConstraintViolation<ExternalAerSiteVisit>> violations = validator.validate(siteVisit);

        assertEquals(0, violations.size());
    }

    @Test
    void invalid_IN_PERSON() {
        final ExternalAerSiteVisit siteVisit = ExternalAerSiteVisit.builder()
            .type(AerSiteVisitType.IN_PERSON)
            .siteVisitDetails(List.of(ExternalAerInPersonSiteVisitDatesDetails.builder().numberOfDays(1).startDate(LocalDate.now()).build()))
            .teamMembers("teamMembers")
            .inPersonVisitReason("inPersonVisitReason")
            .build();

        final Set<ConstraintViolation<ExternalAerSiteVisit>> violations = validator.validate(siteVisit);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{aerVerificationData.external.site.visit.invalid}");
    }

    @ParameterizedTest
    @ValueSource(booleans =  {true, false})
    void valid_VIRTUAL(boolean hasEmptySiteVisitDetails) {
        final ExternalAerSiteVisit siteVisit = ExternalAerSiteVisit.builder()
            .type(AerSiteVisitType.VIRTUAL)
            .inPersonVisitReason("inPersonVisitReason")
            .siteVisitDetails(hasEmptySiteVisitDetails ? new ArrayList<>() : null)
            .build();

        final Set<ConstraintViolation<ExternalAerSiteVisit>> violations = validator.validate(siteVisit);

        assertEquals(0, violations.size());
    }

    @Test
    void invalid_VIRTUAL() {
        final ExternalAerSiteVisit siteVisit = ExternalAerSiteVisit.builder()
            .type(AerSiteVisitType.VIRTUAL)
            .siteVisitDetails(List.of(ExternalAerInPersonSiteVisitDatesDetails.builder().numberOfDays(1).startDate(LocalDate.now()).build()))
            .teamMembers("teamMembers")
            .inPersonVisitReason("inPersonVisitReason")
            .build();

        final Set<ConstraintViolation<ExternalAerSiteVisit>> violations = validator.validate(siteVisit);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{aerVerificationData.external.site.visit.invalid}");
    }
}