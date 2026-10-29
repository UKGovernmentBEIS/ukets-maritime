package uk.gov.mrtm.api.workflow.request.flow.aer.verify.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.service.RequestAerSubmitVerificationService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerApplySubmitVerificationAmendActionHandlerTest {

    @InjectMocks
    private AerApplySubmitVerificationAmendActionHandler submitVerificationActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestAerSubmitVerificationService submitVerificationService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String processTaskId = "processTaskId";
        String requestId = "requestId";
        AppUser user = AppUser.builder().build();
        RequestTaskActionEmptyPayload taskActionPayload = RequestTaskActionEmptyPayload.builder().build();
        Request request = Request.builder().id(requestId).build();
        RequestTask requestTask = RequestTask.builder().id(requestTaskId).request(request).processTaskId(processTaskId).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        submitVerificationActionHandler.process(
            requestTaskId,
            MrtmRequestTaskActionType.AER_SUBMIT_APPLICATION_VERIFICATION,
            user,
            taskActionPayload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(submitVerificationService, times(1)).submitVerificationReport(requestTask, user);
        verify(workflowService, times(1)).completeTask(processTaskId);
        verifyNoMoreInteractions(requestTaskService, submitVerificationService, workflowService);
    }

    @Test
    void getTypes() {
        assertThat(submitVerificationActionHandler.getTypes())
            .containsOnly(MrtmRequestTaskActionType.AER_SUBMIT_APPLICATION_VERIFICATION_AMEND);
    }
}
