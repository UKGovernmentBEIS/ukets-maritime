package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceApplicationSubmittedRequestActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@SuperBuilder
public class EmpIssuanceApplicationAmendsSubmittedRequestActionPayload extends EmpIssuanceApplicationSubmittedRequestActionPayload {
}
