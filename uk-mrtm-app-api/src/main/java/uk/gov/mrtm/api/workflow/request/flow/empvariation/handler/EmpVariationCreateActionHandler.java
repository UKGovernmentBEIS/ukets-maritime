package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestAccountCreateActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestCreateActionEmptyPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmpVariationCreateActionHandler implements RequestAccountCreateActionHandler<RequestCreateActionEmptyPayload> {

	private final StartProcessRequestService startProcessRequestService;
	private final EmissionsMonitoringPlanQueryService empQueryService;

	@Value("${govuk-pay.empVariationPaymentIsActive}")
	private boolean empVariationPaymentIsActive;

	@Override
    public String process(Long accountId, RequestCreateActionEmptyPayload payload, AppUser appUser) {
    	final String currentUserRoleType = appUser.getRoleType();

		EmissionsMonitoringPlanContainer empContainer =
			empQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId)
				.map(EmissionsMonitoringPlanDTO::getEmpContainer)
				.orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));;

    	final EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
	        .payloadType(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD)
	        .originalEmpContainer(empContainer)
	        .build();

		Map<String, Object> processVars =  new HashMap<>();
		processVars.put(BpmnProcessConstants.REQUEST_INITIATOR_ROLE_TYPE, currentUserRoleType);

    	if(RoleTypeConstants.OPERATOR.equals(currentUserRoleType)) {
    		requestPayload.setOperatorAssignee(appUser.getUserId());
    	} else if (RoleTypeConstants.REGULATOR.equals(currentUserRoleType)) {
			requestPayload.setRegulatorAssignee(appUser.getUserId());
			processVars.put(BpmnProcessConstants.SKIP_PAYMENT, !empVariationPaymentIsActive);

    	} else {
    		throw new BusinessException(ErrorCode.REQUEST_CREATE_ACTION_NOT_ALLOWED, currentUserRoleType);
    	}
    	
        RequestParams requestParams = RequestParams.builder()
                .type(MrtmRequestType.EMP_VARIATION)
				.requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestPayload(requestPayload)
                .processVars(processVars)
                .requestMetadata(EmpVariationRequestMetadata.builder()
						.type(MrtmRequestMetadataType.EMP_VARIATION)
						.initiatorRoleType(currentUserRoleType)
						.build())
                .build();

        final Request request = startProcessRequestService.startProcess(requestParams);

        return request.getId();
    }

	@Override
    public String getRequestType() {
        return MrtmRequestType.EMP_VARIATION;
    }
}
