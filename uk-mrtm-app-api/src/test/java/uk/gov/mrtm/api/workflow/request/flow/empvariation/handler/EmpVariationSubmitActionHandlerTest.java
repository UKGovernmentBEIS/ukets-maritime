package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSubmitOutcome;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationSubmitService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationSubmitActionHandlerTest {

    @InjectMocks
    private EmpVariationSubmitActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private EmpVariationSubmitService service;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String requestTaskActionType = MrtmRequestTaskActionType.EMP_VARIATION_SUBMIT_APPLICATION;
        AppUser appUser = AppUser.builder().userId("user").build();
        RequestTaskActionEmptyPayload payload = RequestTaskActionEmptyPayload.builder().build();
        RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);

        String processTaskId = "processTaskId";
        Request request = Request.builder().id("1").build();
        RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .request(request)
            .payload(expectedRequestTaskPayload)
            .processTaskId(processTaskId)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        RequestTaskPayload requestTaskPayload =
            handler.process(requestTaskId, requestTaskActionType, appUser, payload);

        assertThat(request.getSubmissionDate()).isNotNull();
        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(requestTaskService, times(1)).findTaskById(requestTask.getId());
        verify(service, times(1)).submitEmpVariation(requestTask, appUser);
        verify(workflowService, times(1)).completeTask(processTaskId,
                Map.of(MrtmBpmnProcessConstants.EMP_VARIATION_SUBMIT_OUTCOME, EmpVariationSubmitOutcome.SUBMITTED,
                        BpmnProcessConstants.SKIP_PAYMENT, true));
        verifyNoMoreInteractions(requestTaskService, service, workflowService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes())
                .containsExactlyInAnyOrder(MrtmRequestTaskActionType.EMP_VARIATION_SUBMIT_APPLICATION);
    }
}
