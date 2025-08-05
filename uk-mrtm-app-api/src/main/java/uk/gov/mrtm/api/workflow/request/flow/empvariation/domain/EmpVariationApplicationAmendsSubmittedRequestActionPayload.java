package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@SuperBuilder
public class EmpVariationApplicationAmendsSubmittedRequestActionPayload extends EmpVariationApplicationSubmittedRequestActionPayload {
}
