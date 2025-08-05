package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestAccountCreateActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestCreateActionEmptyPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;


@Component
@RequiredArgsConstructor
public class EmpNotificationApplicationCreateActionHandler implements RequestAccountCreateActionHandler<RequestCreateActionEmptyPayload> {

    private final StartProcessRequestService startProcessRequestService;

    @Override
    public String process(Long accountId,
                          RequestCreateActionEmptyPayload payload,
                          AppUser appUser) {
        RequestParams requestParams = createRequestParams(accountId, appUser);

        Request request = startProcessRequestService.startProcess(requestParams);

        return request.getId();
    }

	private RequestParams createRequestParams(Long accountId, AppUser appUser) {
		return RequestParams.builder()
                .type(MrtmRequestType.EMP_NOTIFICATION)
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestPayload(EmpNotificationRequestPayload.builder()
                        .payloadType(MrtmRequestPayloadType.EMP_NOTIFICATION_REQUEST_PAYLOAD)
                        .operatorAssignee(appUser.getUserId())
                        .build())
                .requestMetadata(EmpNotificationRequestMetadata.builder()
                        .type(MrtmRequestMetadataType.EMP_NOTIFICATION)
                        .build())
                .build();
	}

    @Override
    public String getRequestType() {
        return MrtmRequestType.EMP_NOTIFICATION;
    }

}
