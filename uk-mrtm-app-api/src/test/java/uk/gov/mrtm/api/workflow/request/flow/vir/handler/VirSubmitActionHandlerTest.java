package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionPayloadTypes;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VirSubmitActionHandlerTest {

    @InjectMocks
    private VirSubmitActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private VirApplyService applyService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void doProcess() {
        
        final String processId = "processId";
        final RequestTaskActionEmptyPayload payload = RequestTaskActionEmptyPayload.builder()
                .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
                .build();

        final RequestTask requestTask = RequestTask.builder()
                .id(1L)
                .processTaskId(processId)
                .request(Request.builder().build())
                .build();
        final AppUser appUser = AppUser.builder().build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        handler.process(requestTask.getId(), MrtmRequestTaskActionType.VIR_SUBMIT_APPLICATION, appUser, payload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(1L);
        verify(applyService, times(1)).applySubmitAction(requestTask, appUser);
        verify(workflowService, times(1)).completeTask(processId);
    }

    @Test
    void getTypes() {

        final List<String> actual = handler.getTypes();

        assertThat(actual).isEqualTo(List.of(MrtmRequestTaskActionType.VIR_SUBMIT_APPLICATION));
    }
}
