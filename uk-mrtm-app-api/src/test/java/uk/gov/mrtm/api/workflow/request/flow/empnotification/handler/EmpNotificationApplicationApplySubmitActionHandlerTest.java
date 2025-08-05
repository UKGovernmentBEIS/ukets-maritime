package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationOutcome;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.RequestEmpNotificationService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionPayloadTypes;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationApplicationApplySubmitActionHandlerTest {


    @InjectMocks
    private EmpNotificationApplicationApplySubmitActionHandler handler;

    @Mock
    private RequestEmpNotificationService requestEmpNotificationService;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {
        RequestTaskActionEmptyPayload submitPayload = RequestTaskActionEmptyPayload.builder()
            .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
            .build();
        AppUser appUser = AppUser.builder().build();
        String processTaskId = "processTaskId";
        Request request = Request.builder().id("1").build();
        RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .payload(expectedRequestTaskPayload)
            .request(request)
            .processTaskId(processTaskId)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_NOTIFICATION_SUBMIT_APPLICATION, appUser, submitPayload);

        // Verify
        assertThat(request.getSubmissionDate()).isNotNull();
        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(requestTaskService).findTaskById(requestTask.getId());
        verify(requestEmpNotificationService).applySubmitPayload(requestTask, appUser);
        verify(workflowService).completeTask(processTaskId,
            Map.of(MrtmBpmnProcessConstants.NOTIFICATION_OUTCOME, EmpNotificationOutcome.SUBMITTED));

        verifyNoMoreInteractions(workflowService, requestTaskService, requestEmpNotificationService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes())
            .containsExactly(MrtmRequestTaskActionType.EMP_NOTIFICATION_SUBMIT_APPLICATION);
    }
}
