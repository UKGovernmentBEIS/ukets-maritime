package uk.gov.mrtm.api.workflow.request.flow.accountclosure.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestCreateActionPayloadTypes;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestCreateActionEmptyPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountClosureCreateActionHandlerTest {

    @InjectMocks
    private AccountClosureCreateActionHandler handler;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void getRequestType() {
        assertThat(handler.getRequestType()).isEqualTo(MrtmRequestType.ACCOUNT_CLOSURE);
    }

    @Test
    void process() {
        final Long accountId = 1L;
        final RequestCreateActionEmptyPayload payload =
                RequestCreateActionEmptyPayload.builder().payloadType(RequestCreateActionPayloadTypes.EMPTY_PAYLOAD).build();
        final AppUser appUser = AppUser.builder().userId("userId")
                .authorities(List.of(AppAuthority.builder().accountId(accountId).build()))
                .build();

        RequestParams expectedRequestParams = RequestParams.builder()
                .type(MrtmRequestType.ACCOUNT_CLOSURE)
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestPayload(AccountClosureRequestPayload.builder()
                        .payloadType(MrtmRequestPayloadType.ACCOUNT_CLOSURE_REQUEST_PAYLOAD)
                        .regulatorAssignee(appUser.getUserId())
                        .build())
                .build();

        when(startProcessRequestService.startProcess(expectedRequestParams))
                .thenReturn(Request.builder().id("requestId").build());


        final String requestId = handler.process(accountId, payload, appUser);

        verify(startProcessRequestService, times(1)).startProcess(expectedRequestParams);

        assertEquals("requestId", requestId);
        verifyNoMoreInteractions(startProcessRequestService);
    }
}
