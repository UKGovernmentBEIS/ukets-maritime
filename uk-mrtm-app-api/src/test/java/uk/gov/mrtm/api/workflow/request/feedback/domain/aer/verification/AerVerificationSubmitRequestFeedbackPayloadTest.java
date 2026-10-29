package uk.gov.mrtm.api.workflow.request.feedback.domain.aer.verification;

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
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerFeedbackCompletionMethod;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerFeedbackReviewGroups;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.common.FeedbackEaseRating;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerVerificationSubmitRequestFeedbackPayloadTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @ParameterizedTest
    @EnumSource(value = AerVerificationFeedbackCompletionMethod.class, names = {"OTHER"}, mode = EnumSource.Mode.EXCLUDE)
    void validate_no_feedback_valid(AerVerificationFeedbackCompletionMethod group) {
        AerVerificationSubmitRequestFeedbackPayload payload = AerVerificationSubmitRequestFeedbackPayload.builder()
            .opinionStatementEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(group))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(AerVerificationFeedbackReviewGroups.NO_FEEDBACK))
            .feedbackReviewGroupsComment(null)
            .additionalComments("additional")
            .build();

        assertEquals(0, validator.validate(payload).size());
    }


    @ParameterizedTest
    @EnumSource(value = AerVerificationFeedbackReviewGroups.class, names = {"NO_FEEDBACK"}, mode = EnumSource.Mode.EXCLUDE)
    void validate_with_feedback_valid(AerVerificationFeedbackReviewGroups group) {
        AerVerificationSubmitRequestFeedbackPayload payload = AerVerificationSubmitRequestFeedbackPayload.builder()
            .opinionStatementEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerVerificationFeedbackCompletionMethod.TYPED_INTO_FORM_SECTIONS))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(group))
            .feedbackReviewGroupsComment("feedbackReviewGroupsComment")
            .additionalComments("additional")
            .build();

        assertEquals(0, validator.validate(payload).size());
    }

    @ParameterizedTest
    @EnumSource(value = AerVerificationFeedbackReviewGroups.class, names = {"NO_FEEDBACK"}, mode = EnumSource.Mode.EXCLUDE)
    void validate_with_feedback_and_more_invalid_without_comment(AerVerificationFeedbackReviewGroups group) {
        AerVerificationSubmitRequestFeedbackPayload payload = AerVerificationSubmitRequestFeedbackPayload.builder()
            .opinionStatementEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerVerificationFeedbackCompletionMethod.TYPED_INTO_FORM_SECTIONS))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(group, AerVerificationFeedbackReviewGroups.NO_FEEDBACK))
            .feedbackReviewGroupsComment(null)
            .additionalComments("additional")
            .build();

        Set<ConstraintViolation<AerVerificationSubmitRequestFeedbackPayload>> violations = validator.validate(payload);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{request.feedback.no.feedback.uniqueness}");
    }

    @ParameterizedTest
    @EnumSource(value = AerVerificationFeedbackReviewGroups.class, names = {"NO_FEEDBACK"}, mode = EnumSource.Mode.EXCLUDE)
    void validate_with_feedback_and_more_invalid_with_comment(AerVerificationFeedbackReviewGroups group) {
        AerVerificationSubmitRequestFeedbackPayload payload = AerVerificationSubmitRequestFeedbackPayload.builder()
            .opinionStatementEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerVerificationFeedbackCompletionMethod.TYPED_INTO_FORM_SECTIONS))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(group, AerVerificationFeedbackReviewGroups.NO_FEEDBACK))
            .feedbackReviewGroupsComment("feedbackReviewGroupsComment")
            .additionalComments("additional")
            .build();

        Set<ConstraintViolation<AerVerificationSubmitRequestFeedbackPayload>> violations = validator.validate(payload);

        assertEquals(2, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactlyInAnyOrder("{request.feedback.no.feedback.uniqueness}", "{request.feedback.no.feedback.no.comment}");
    }

    @Test
    void validate_with_all_completion_methods_including_other_invalid() {
        AerVerificationSubmitRequestFeedbackPayload payload = AerVerificationSubmitRequestFeedbackPayload.builder()
            .opinionStatementEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerVerificationFeedbackCompletionMethod.values()))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(AerVerificationFeedbackReviewGroups.NO_FEEDBACK))
            .feedbackReviewGroupsComment(null)
            .additionalComments("additional")
            .build();

        Set<ConstraintViolation<AerVerificationSubmitRequestFeedbackPayload>> violations = validator.validate(payload);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{request.feedback.other.report.completion.method}");
    }

    @Test
    void validate_with_completion_method_other_invalid() {
        AerVerificationSubmitRequestFeedbackPayload payload = AerVerificationSubmitRequestFeedbackPayload.builder()
            .opinionStatementEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerVerificationFeedbackCompletionMethod.OTHER))
            .otherReportCompletionMethods(null)
            .feedbackReviewGroups(Set.of(AerVerificationFeedbackReviewGroups.NO_FEEDBACK))
            .feedbackReviewGroupsComment(null)
            .additionalComments("additional")
            .build();

        Set<ConstraintViolation<AerVerificationSubmitRequestFeedbackPayload>> violations = validator.validate(payload);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{request.feedback.other.report.completion.method}");
    }
}