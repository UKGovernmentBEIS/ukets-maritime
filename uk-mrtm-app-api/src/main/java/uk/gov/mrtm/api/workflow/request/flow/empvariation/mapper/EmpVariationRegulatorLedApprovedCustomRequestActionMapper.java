package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationRegulatorLedApprovedRequestActionPayload;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.netz.api.workflow.request.core.transform.RequestActionCustomMapper;
import uk.gov.netz.api.workflow.request.core.transform.RequestActionMapper;

import java.util.Set;

@Component
public class EmpVariationRegulatorLedApprovedCustomRequestActionMapper implements RequestActionCustomMapper {

	private final RequestActionMapper requestActionMapper = Mappers.getMapper(RequestActionMapper.class);

    private final EmpVariationSubmitRegulatorLedMapper empVariationSubmitRegulatorLedMapper = Mappers
            .getMapper(EmpVariationSubmitRegulatorLedMapper.class);
    
	@Override
	public RequestActionDTO toRequestActionDTO(RequestAction requestAction) {
		final EmpVariationApplicationRegulatorLedApprovedRequestActionPayload requestActionPayload = (EmpVariationApplicationRegulatorLedApprovedRequestActionPayload) requestAction
				.getPayload();
		final RequestActionDTO requestActionDTO = requestActionMapper.toRequestActionDTOIgnorePayload(requestAction);
		final EmpVariationApplicationRegulatorLedApprovedRequestActionPayload dtoPayload = empVariationSubmitRegulatorLedMapper
				.cloneRegulatorLedApprovedPayloadIgnoreDecisionNotes(requestActionPayload);

		requestActionDTO.setPayload(dtoPayload);
		return requestActionDTO;
	}

	@Override
	public String getRequestActionType() {
		return MrtmRequestActionType.EMP_VARIATION_APPLICATION_REGULATOR_LED_APPROVED;
	}

	@Override
	public Set<String> getUserRoleTypes() {
		return Set.of(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
	}

}
