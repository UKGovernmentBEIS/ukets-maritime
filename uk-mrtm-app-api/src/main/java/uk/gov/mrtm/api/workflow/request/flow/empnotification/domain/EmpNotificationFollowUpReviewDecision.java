package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpNotificationFollowUpReviewDecision {

    @NotNull
    private EmpNotificationFollowUpReviewDecisionType type;

    @Valid
    @Schema(
            discriminatorMapping = {
                    @DiscriminatorMapping(schema = ReviewDecisionDetails.class, value = "ACCEPTED"),
                    @DiscriminatorMapping(schema = EmpNotificationFollowupRequiredChangesDecisionDetails.class, value = "AMENDS_NEEDED")
            },
            discriminatorProperty = "type")
    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = As.EXTERNAL_PROPERTY, property = "type", visible = true)
    @JsonSubTypes({
        @JsonSubTypes.Type(value = ReviewDecisionDetails.class, name = "ACCEPTED"),
        @JsonSubTypes.Type(value = EmpNotificationFollowupRequiredChangesDecisionDetails.class, name = "AMENDS_NEEDED")
    })
    private ReviewDecisionDetails details;
}
