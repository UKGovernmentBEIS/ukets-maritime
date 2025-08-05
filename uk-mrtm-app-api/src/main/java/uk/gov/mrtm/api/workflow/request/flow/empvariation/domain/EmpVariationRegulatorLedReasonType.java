package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EmpVariationRegulatorLedReasonType {

	FOLLOWING_IMPROVING_REPORT("The Environment Agency has varied your emissions monitoring plan as it considered it necessary as a consequence of a verifier improvement report submitted by you."),
	FAILED_TO_COMPLY_OR_APPLY("The Environment Agency has varied your emissions monitoring plan as you failed to comply with a requirement or condition of your emissions monitoring plan."),
	OTHER("The Environment Agency has varied your emissions monitoring plan ");

	private final String description;
}
