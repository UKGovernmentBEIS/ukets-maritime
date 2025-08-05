package uk.gov.mrtm.api.workflow.request.flow.accountclosure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureRequestPayload;
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
public class AccountClosureCreateActionHandler implements RequestAccountCreateActionHandler<RequestCreateActionEmptyPayload> {

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
            .type(MrtmRequestType.ACCOUNT_CLOSURE)
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .requestPayload(AccountClosureRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.ACCOUNT_CLOSURE_REQUEST_PAYLOAD)
                .regulatorAssignee(appUser.getUserId())
                .build())
            .build();
	}

    @Override
    public String getRequestType() {
        return MrtmRequestType.ACCOUNT_CLOSURE;
    }

}
