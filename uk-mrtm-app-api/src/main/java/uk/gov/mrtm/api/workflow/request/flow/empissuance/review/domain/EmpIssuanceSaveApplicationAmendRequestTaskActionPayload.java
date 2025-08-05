package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;

import java.util.HashSet;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class EmpIssuanceSaveApplicationAmendRequestTaskActionPayload extends EmpIssuanceSaveApplicationReviewRequestTaskActionPayload {

    @Builder.Default
    private Set<EmpReviewGroup> updatedSubtasks = new HashSet<>();
}
