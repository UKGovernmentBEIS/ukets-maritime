package uk.gov.mrtm.api.integration.external.verification.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import uk.gov.mrtm.api.reporting.domain.verification.AerNotVerifiedDecisionReasonType;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationDecisionType;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ExternalAerVerificationDecisionTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void valid_VERIFIED_AS_SATISFACTORY() {
        final ExternalAerVerificationDecision siteVisit = ExternalAerVerificationDecision.builder()
            .type(AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY)
            .build();

        final Set<ConstraintViolation<ExternalAerVerificationDecision>> violations = validator.validate(siteVisit);

        assertEquals(0, violations.size());
    }

    @ParameterizedTest
    @MethodSource
    void invalid_VERIFIED_AS_SATISFACTORY(List<String> comments,
                                          Set<ExternalAerNotVerifiedDecisionReason> notVerifiedReasons) {
        final ExternalAerVerificationDecision siteVisit = ExternalAerVerificationDecision.builder()
            .type(AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY)
            .comments(comments)
            .notVerifiedReasons(notVerifiedReasons)
            .build();

        final Set<ConstraintViolation<ExternalAerVerificationDecision>> violations = validator.validate(siteVisit);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{aerVerificationData.external.decision.invalid}");
    }

    private static Stream<Arguments> invalid_VERIFIED_AS_SATISFACTORY() {
        Set<ExternalAerNotVerifiedDecisionReason> notVerifiedReasons = Set.of(
            ExternalAerNotVerifiedDecisionReason.builder().type(AerNotVerifiedDecisionReasonType.UNCORRECTED_MATERIAL_NON_CONFORMITY).build());

        List<String> comments = List.of("comments");
        return Stream.of(
            Arguments.of(comments, notVerifiedReasons),
            Arguments.of(new ArrayList<>(), notVerifiedReasons),
            Arguments.of(comments, new HashSet<>())
        );
    }

    @Test
    void valid_VERIFIED_AS_SATISFACTORY_WITH_COMMENTS() {
        final ExternalAerVerificationDecision siteVisit = ExternalAerVerificationDecision.builder()
            .type(AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY_WITH_COMMENTS)
            .comments(List.of("comments"))
            .build();

        final Set<ConstraintViolation<ExternalAerVerificationDecision>> violations = validator.validate(siteVisit);

        assertEquals(0, violations.size());
    }

    @ParameterizedTest
    @MethodSource
    void invalid_VERIFIED_AS_SATISFACTORY_WITH_COMMENTS(List<String> comments,
                                                        Set<ExternalAerNotVerifiedDecisionReason> notVerifiedReasons) {
        final ExternalAerVerificationDecision siteVisit = ExternalAerVerificationDecision.builder()
            .type(AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY_WITH_COMMENTS)
            .comments(comments)
            .notVerifiedReasons(notVerifiedReasons)
            .build();

        final Set<ConstraintViolation<ExternalAerVerificationDecision>> violations = validator.validate(siteVisit);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{aerVerificationData.external.decision.invalid}");
    }

    private static Stream<Arguments> invalid_VERIFIED_AS_SATISFACTORY_WITH_COMMENTS() {
        Set<ExternalAerNotVerifiedDecisionReason> notVerifiedReasons = Set.of(
            ExternalAerNotVerifiedDecisionReason.builder().type(AerNotVerifiedDecisionReasonType.UNCORRECTED_MATERIAL_NON_CONFORMITY).build());

        List<String> comments = List.of("comments");
        return Stream.of(
            Arguments.of(comments, notVerifiedReasons),
            Arguments.of(new ArrayList<>(), notVerifiedReasons),
            Arguments.of(new ArrayList<>(), new HashSet<>())
        );
    }

    @Test
    void valid_NOT_VERIFIED() {
        final ExternalAerVerificationDecision siteVisit = ExternalAerVerificationDecision.builder()
            .type(AerVerificationDecisionType.NOT_VERIFIED)
            .notVerifiedReasons(Set.of(ExternalAerNotVerifiedDecisionReason.builder().type(AerNotVerifiedDecisionReasonType.UNCORRECTED_MATERIAL_NON_CONFORMITY).build()))
            .build();

        final Set<ConstraintViolation<ExternalAerVerificationDecision>> violations = validator.validate(siteVisit);

        assertEquals(0, violations.size());
    }

    @ParameterizedTest
    @MethodSource
    void invalid_NOT_VERIFIED(List<String> comments, Set<ExternalAerNotVerifiedDecisionReason> notVerifiedReasons) {
        final ExternalAerVerificationDecision siteVisit = ExternalAerVerificationDecision.builder()
            .type(AerVerificationDecisionType.NOT_VERIFIED)
            .comments(comments)
            .notVerifiedReasons(notVerifiedReasons)
            .build();

        final Set<ConstraintViolation<ExternalAerVerificationDecision>> violations = validator.validate(siteVisit);

        assertEquals(1, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactly("{aerVerificationData.external.decision.invalid}");
    }

    private static Stream<Arguments> invalid_NOT_VERIFIED() {
        Set<ExternalAerNotVerifiedDecisionReason> notVerifiedReasons = Set.of(
            ExternalAerNotVerifiedDecisionReason.builder().type(AerNotVerifiedDecisionReasonType.UNCORRECTED_MATERIAL_NON_CONFORMITY).build());

        List<String> comments = List.of("comments");
        return Stream.of(
            Arguments.of(comments, notVerifiedReasons),
            Arguments.of(comments, new HashSet<>()),
            Arguments.of(new ArrayList<>(), new HashSet<>())
        );
    }
}