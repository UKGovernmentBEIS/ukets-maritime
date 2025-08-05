package uk.gov.mrtm.api.workflow.request.flow.accountclosure.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.service.RequestAccountClosureService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountClosureCancelledHandlerTest {

    @InjectMocks
    private AccountClosureCancelledHandler handler;

    @Mock
    private RequestAccountClosureService requestAccountClosureService;
    @Mock
    private WorkflowService workflowService;
    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {

        AppUser appUser = AppUser.builder().build();
        String processTaskId = "processTaskId";
        Request request = Request.builder().id("id").build();
        RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .payload(expectedRequestTaskPayload)
            .processTaskId(processTaskId)
            .request(request)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.ACCOUNT_CLOSURE_CANCEL_APPLICATION,
            appUser,
            RequestTaskActionEmptyPayload.builder().build());

        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(requestAccountClosureService).cancel("id");
        verify(requestTaskService).findTaskById(requestTask.getId());
        verify(workflowService).completeTask(processTaskId);
        verifyNoMoreInteractions(requestAccountClosureService,requestTaskService, workflowService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.ACCOUNT_CLOSURE_CANCEL_APPLICATION);
    }
}
