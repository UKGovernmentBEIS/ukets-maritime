package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestCreateActionPayloadTypes;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerReInitiateCreateActionHandlerTest {

    @InjectMocks
    private AerReInitiateCreateActionHandler handler;

    @Mock
    private RequestService requestService;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void process() {
        final long accountId = 1L;
        final String requestId = "AEM-1";
        final String userId = "userId";
        final AppUser user = AppUser.builder().userId(userId).build();
        final ReportRelatedRequestCreateActionPayload actionPayload = ReportRelatedRequestCreateActionPayload.builder()
                .payloadType(RequestCreateActionPayloadTypes.REPORT_RELATED_REQUEST_CREATE_ACTION_PAYLOAD)
                .requestId(requestId)
                .build();

        Request request = Request.builder().payload(AerRequestPayload.builder().build()).build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        // Invoke
        String actual = handler.process(accountId, actionPayload, user);

        // Verify
        Assertions.assertEquals(requestId, actual);
        verify(requestService, times(1)).findRequestById(requestId);
        verify(startProcessRequestService, times(1)).reStartProcess(request);
        verify(requestService, times(1))
                .addActionToRequest(request, null, MrtmRequestActionType.AER_APPLICATION_RE_INITIATED, userId);
    }

    @Test
    void getRequestCreateActionType() {
        Assertions.assertEquals(MrtmRequestType.AER, handler.getRequestType());
    }
}
