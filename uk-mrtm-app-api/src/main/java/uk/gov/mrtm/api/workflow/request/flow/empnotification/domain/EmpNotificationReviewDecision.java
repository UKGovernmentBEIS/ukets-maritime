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
@Schema(
    discriminatorMapping = {
        @DiscriminatorMapping(schema = EmpNotificationAcceptedDecisionDetails.class, value = "ACCEPTED"),
        @DiscriminatorMapping(schema = EmpNotificationReviewDecisionDetails.class, value = "REJECTED")
    },
    discriminatorProperty = "type")
public class EmpNotificationReviewDecision {

    @NotNull
    private EmpNotificationReviewDecisionType type;

    @Valid
    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = As.EXTERNAL_PROPERTY, property = "type", visible = true)
    @JsonSubTypes({
        @JsonSubTypes.Type(value = EmpNotificationAcceptedDecisionDetails.class, name = "ACCEPTED"),
        @JsonSubTypes.Type(value = EmpNotificationReviewDecisionDetails.class, name = "REJECTED")
    })
    private ReviewDecisionDetails details;
}
