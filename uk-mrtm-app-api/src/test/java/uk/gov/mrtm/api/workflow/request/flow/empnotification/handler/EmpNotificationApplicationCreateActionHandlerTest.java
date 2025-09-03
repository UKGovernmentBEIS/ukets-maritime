package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationApplicationCreateActionHandlerTest {

    @InjectMocks
    private EmpNotificationApplicationCreateActionHandler handler;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void process() {
        Long accountId = 1L;
        RequestCreateActionEmptyPayload payload = RequestCreateActionEmptyPayload.builder()
            .payloadType(RequestCreateActionPayloadTypes.EMPTY_PAYLOAD).build();
        AppUser appUser = AppUser.builder().userId("user").authorities(List.of(AppAuthority.builder()
                .accountId(accountId).build()))
            .build();

        RequestParams expectedRequestParams = RequestParams.builder()
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

        when(startProcessRequestService.startProcess(expectedRequestParams))
            .thenReturn(Request.builder().id("requestId").build());

        final String requestId = handler.process(accountId, payload, appUser);

        verify(startProcessRequestService, times(1)).startProcess(expectedRequestParams);

        assertEquals("requestId", requestId);

        verifyNoMoreInteractions(startProcessRequestService);
    }
}