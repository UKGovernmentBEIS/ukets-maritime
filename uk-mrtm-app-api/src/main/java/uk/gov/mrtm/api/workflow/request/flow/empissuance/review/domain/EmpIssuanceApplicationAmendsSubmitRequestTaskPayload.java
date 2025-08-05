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

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EmpIssuanceApplicationAmendsSubmitRequestTaskPayload extends EmpIssuanceApplicationReviewRequestTaskPayload{

    @Builder.Default
    private Set<EmpReviewGroup> updatedSubtasks = new HashSet<>();
}

