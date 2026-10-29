package uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.feedback.domain.common.FeedbackEaseRating;
import uk.gov.mrtm.api.workflow.request.feedback.domain.empissuance.EmpFeedbackCompletionMethod;
import uk.gov.mrtm.api.workflow.request.feedback.domain.empissuance.EmpFeedbackReviewGroups;
import uk.gov.mrtm.api.workflow.request.feedback.domain.empissuance.EmpIssuanceSubmitRequestFeedbackPayload;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerSubmitRequestFeedbackPayloadTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @ParameterizedTest
    @EnumSource(value = AerFeedbackCompletionMethod.class, names = {"OTHER"}, mode = EnumSource.Mode.EXCLUDE)
    void validate_no_feedback_valid(AerFeedbackCompletionMethod group) {
        AerSubmitRequestFeedbackPayload payload = AerSubmitRequestFeedbackPayload.builder()
            .reportCompletionEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(group))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(AerFeedbackReviewGroups.NO_FEEDBACK))
            .feedbackReviewGroupsComment(null)
            .additionalComments("additional")
            .build();

        assertEquals(0, validator.validate(payload).size());
    }

    @ParameterizedTest
    @EnumSource(value = AerFeedbackReviewGroups.class, names = {"NO_FEEDBACK"}, mode = EnumSource.Mode.EXCLUDE)
    void validate_with_feedback_valid(AerFeedbackReviewGroups group) {
        AerSubmitRequestFeedbackPayload payload = AerSubmitRequestFeedbackPayload.builder()
            .reportCompletionEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerFeedbackCompletionMethod.TYPED_INTO_FORM_SECTIONS))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(group))
            .feedbackReviewGroupsComment("feedbackReviewGroupsComment")
            .additionalComments("additional")
            .build();

        assertEquals(0, validator.validate(payload).size());
    }

    @ParameterizedTest
    @EnumSource(value = AerFeedbackReviewGroups.class, names = {"NO_FEEDBACK"}, mode = EnumSource.Mode.EXCLUDE)
    void validate_with_feedback_and_more_invalid_without_comment(AerFeedbackReviewGroups group) {
        AerSubmitRequestFeedbackPayload payload = AerSubmitRequestFeedbackPayload.builder()
            .reportCompletionEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerFeedbackCompletionMethod.TYPED_INTO_FORM_SECTIONS))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(group, AerFeedbackReviewGroups.NO_FEEDBACK))
            .feedbackReviewGroupsComment(null)
            .additionalComments("additional")
            .build();

        Set<ConstraintViolation<AerSubmitRequestFeedbackPayload>> violations = validator.validate(payload);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{request.feedback.no.feedback.uniqueness}");
    }

    @ParameterizedTest
    @EnumSource(value = AerFeedbackReviewGroups.class, names = {"NO_FEEDBACK"}, mode = EnumSource.Mode.EXCLUDE)
    void validate_with_feedback_and_more_invalid_with_comment(AerFeedbackReviewGroups group) {
        AerSubmitRequestFeedbackPayload payload = AerSubmitRequestFeedbackPayload.builder()
            .reportCompletionEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerFeedbackCompletionMethod.TYPED_INTO_FORM_SECTIONS))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(group, AerFeedbackReviewGroups.NO_FEEDBACK))
            .feedbackReviewGroupsComment("feedbackReviewGroupsComment")
            .additionalComments("additional")
            .build();

        Set<ConstraintViolation<AerSubmitRequestFeedbackPayload>> violations = validator.validate(payload);

        assertEquals(2, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactlyInAnyOrder("{request.feedback.no.feedback.uniqueness}", "{request.feedback.no.feedback.no.comment}");
    }

    @Test
    void validate_with_all_completion_methods_including_other_invalid() {
        AerSubmitRequestFeedbackPayload payload = AerSubmitRequestFeedbackPayload.builder()
            .reportCompletionEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerFeedbackCompletionMethod.values()))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(AerFeedbackReviewGroups.NO_FEEDBACK))
            .feedbackReviewGroupsComment(null)
            .additionalComments("additional")
            .build();

        Set<ConstraintViolation<AerSubmitRequestFeedbackPayload>> violations = validator.validate(payload);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{request.feedback.other.report.completion.method}");
    }

    @Test
    void validate_with_completion_method_other_invalid() {
        AerSubmitRequestFeedbackPayload payload = AerSubmitRequestFeedbackPayload.builder()
            .reportCompletionEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerFeedbackCompletionMethod.OTHER))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(AerFeedbackReviewGroups.NO_FEEDBACK))
            .feedbackReviewGroupsComment(null)
            .additionalComments("additional")
            .build();

        Set<ConstraintViolation<AerSubmitRequestFeedbackPayload>> violations = validator.validate(payload);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{request.feedback.other.report.completion.method}");
    }
}