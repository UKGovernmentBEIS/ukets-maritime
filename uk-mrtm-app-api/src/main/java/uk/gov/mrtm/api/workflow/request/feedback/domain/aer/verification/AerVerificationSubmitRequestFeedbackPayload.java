package uk.gov.mrtm.api.workflow.request.feedback.domain.aer.verification;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerFeedbackCompletionMethod;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerFeedbackReviewGroups;
import uk.gov.mrtm.api.workflow.request.feedback.domain.common.FeedbackEaseRating;
import uk.gov.netz.api.common.validation.SpELExpression;
import uk.gov.netz.api.request.feedback.domain.RequestFeedbackPayload;

import java.util.HashSet;
import java.util.Set;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{(#reportCompletionMethods.contains('OTHER')) == (#otherReportCompletionMethods != null)}", message = "request.feedback.other.report.completion.method")
@SpELExpression(expression = "{(#feedbackReviewGroups.contains('NO_FEEDBACK')) == (#feedbackReviewGroupsComment == null)}", message = "request.feedback.no.feedback.no.comment")
@SpELExpression(expression = "{!#feedbackReviewGroups.contains('NO_FEEDBACK') || #feedbackReviewGroups.size() == 1}", message = "request.feedback.no.feedback.uniqueness")
public class AerVerificationSubmitRequestFeedbackPayload extends RequestFeedbackPayload {

	private static int VERSION = 1;

	@NotNull
	private FeedbackEaseRating opinionStatementEaseRating;

	@NotEmpty
	@Builder.Default
	private Set<AerVerificationFeedbackCompletionMethod> reportCompletionMethods = new HashSet<>();

	@Size(max = 10000)
	private String otherReportCompletionMethods;

	@NotEmpty
	@Builder.Default
	private Set<AerVerificationFeedbackReviewGroups> feedbackReviewGroups = new HashSet<>();

	@Size(max = 10000)
	private String feedbackReviewGroupsComment;

	@Size(max = 10000)
	private String additionalComments;

	@JsonProperty(value = "version", access = JsonProperty.Access.READ_ONLY)
	public int getVersion() {
		return VERSION;
	}
}
