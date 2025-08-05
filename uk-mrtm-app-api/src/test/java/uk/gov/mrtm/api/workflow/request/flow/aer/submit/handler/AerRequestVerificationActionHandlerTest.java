package uk.gov.mrtm.api.workflow.request.flow.aer.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerOutcome;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.service.RequestAerSubmitService;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionPayloadTypes;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerRequestVerificationActionHandlerTest {

    @InjectMocks
    private AerRequestVerificationActionHandler aerRequestVerificationActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestAerSubmitService requestAerSubmitService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String processId = "processId";
        String requestId = "requestId";
        RequestTask task = RequestTask.builder()
            .request(Request.builder().id(requestId).build())
            .processTaskId(processId)
            .build();
        AppUser user = AppUser.builder().build();
        RequestTaskActionEmptyPayload taskActionPayload = RequestTaskActionEmptyPayload.builder()
            .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
            .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(task);

        // Invoke
        aerRequestVerificationActionHandler
            .process(requestTaskId, MrtmRequestTaskActionType.AER_REQUEST_VERIFICATION, user, taskActionPayload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(requestAerSubmitService, times(1)).sendToVerifier(task, user);
        verify(workflowService, times(1)).completeTask(processId,
            Map.of(BpmnProcessConstants.REQUEST_ID, requestId,
                MrtmBpmnProcessConstants.AER_OUTCOME, AerOutcome.VERIFICATION_REQUESTED));
    }

    @Test
    void getTypes() {
        assertThat(aerRequestVerificationActionHandler.getTypes())
            .containsOnly(MrtmRequestTaskActionType.AER_REQUEST_VERIFICATION);
    }
}