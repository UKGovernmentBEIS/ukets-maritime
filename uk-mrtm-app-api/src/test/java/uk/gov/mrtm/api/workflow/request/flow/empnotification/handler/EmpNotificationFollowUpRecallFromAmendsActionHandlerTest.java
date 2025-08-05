package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpRecallFromAmendsActionHandlerTest {

    @InjectMocks
    private EmpNotificationFollowUpRecallFromAmendsActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestService requestService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {

        final AppUser appUser = AppUser.builder().userId("userId").build();
        final String processTaskId = "processTaskId";
        final Request request =
            Request.builder().id("requestId").payload(EmpNotificationRequestPayload.builder().build()).build();
        final RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .processTaskId(processTaskId)
            .request(request)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_RECALL_FROM_AMENDS,
            appUser,
            RequestTaskActionEmptyPayload.builder().build());

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTask.getId());
        verify(requestService, times(1)).addActionToRequest(request,
            null,
            MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_RECALLED_FROM_AMENDS,
            "userId");
        verify(workflowService, times(1)).completeTask("processTaskId");
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes())
            .containsExactly(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_RECALL_FROM_AMENDS);
    }

    @Test
    void getRequestActionType() {
        assertEquals(MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_RECALLED_FROM_AMENDS,
            handler.getRequestActionType());
    }
}