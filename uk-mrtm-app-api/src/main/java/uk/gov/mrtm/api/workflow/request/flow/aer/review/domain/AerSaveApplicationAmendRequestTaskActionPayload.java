package uk.gov.mrtm.api.workflow.request.flow.aer.review.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerSaveApplicationRequestTaskActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@SuperBuilder
public class AerSaveApplicationAmendRequestTaskActionPayload extends AerSaveApplicationRequestTaskActionPayload {
}
