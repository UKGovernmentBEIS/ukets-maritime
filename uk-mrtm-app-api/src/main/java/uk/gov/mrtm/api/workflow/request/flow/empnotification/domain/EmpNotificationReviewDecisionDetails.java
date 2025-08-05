package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class EmpNotificationReviewDecisionDetails extends ReviewDecisionDetails {

    @NotBlank
    @Size(max = 10000)
    private String officialNotice;

}
