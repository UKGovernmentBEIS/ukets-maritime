package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EmpVariationChangeType {

	ADD_NEW_SHIP,
	ADD_NEW_FUELS_OR_EMISSION_SOURCES,
	CHANGE_MONITORING_METHOD,
	CHANGE_EMISSION_FACTOR_VALUES,
	CHANGE_COMPANY_NAME_OR_REGISTERED_ADDRESS,
	USE_OF_EXEMPTION,
	USE_OF_CARBON,
	OTHER_SIGNIFICANT,

	REMOVING_SHIP,
	UPDATE_PROCEDURES,
	OTHER_NON_SIGNIFICANT;
}
