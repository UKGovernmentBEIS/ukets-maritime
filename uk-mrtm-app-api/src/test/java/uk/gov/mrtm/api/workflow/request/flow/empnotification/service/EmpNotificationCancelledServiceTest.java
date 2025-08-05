package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationCancelledServiceTest {

    @InjectMocks
    private EmpNotificationCancelledService service;

    @Mock
    private RequestService requestService;

    @Test
    void cancel() {
        final String requestId = "id";
        final String assignee = "assignee";
        final EmpNotificationRequestPayload payload = EmpNotificationRequestPayload.builder()
                .operatorAssignee(assignee)
                .build();
        final Request request = Request.builder()
                .id(requestId)
                .payload(payload)
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        // Invoke
        service.cancel(requestId);

        // Verify
        verify(requestService).addActionToRequest(request, null,
                MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_CANCELLED, assignee);
        verifyNoMoreInteractions(requestService);
    }
}
