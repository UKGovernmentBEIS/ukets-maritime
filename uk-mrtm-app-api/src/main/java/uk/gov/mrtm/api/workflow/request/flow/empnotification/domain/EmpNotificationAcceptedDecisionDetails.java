package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class EmpNotificationAcceptedDecisionDetails extends EmpNotificationReviewDecisionDetails {

    @Valid
    @NotNull(message = "empNotification.reviewDecision.followUp")
    private FollowUp followUp;

}
