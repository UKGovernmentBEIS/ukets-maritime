package uk.gov.mrtm.api.workflow.request.flow.accountclosure.handler;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.service.RequestAccountClosureService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionPayloadTypes;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountClosureSubmitActionHandlerTest {

    @InjectMocks
    private AccountClosureSubmitActionHandler handler;

    @Mock
    private RequestService requestService;
    @Mock
    private RequestAccountClosureService requestAccountClosureService;
    @Mock
    private WorkflowService workflowService;
    @Mock
    private RequestTaskService requestTaskService;
    @Mock
    private RequestQueryService requestQueryService;

    @Test
    void process() {

        RequestTaskActionEmptyPayload taskActionPayload =
                RequestTaskActionEmptyPayload.builder()
                        .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
                        .build();
        AppUser appUser = AppUser.builder().build();
        String processTaskId = "processTaskId";
        Request request = Request.builder().id("1").requestResources(List.of(RequestResource.builder().resourceId("100").resourceType(ResourceType.ACCOUNT).build())).build();
        RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .request(request)
            .payload(expectedRequestTaskPayload)
            .processTaskId(processTaskId)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);
        when(requestQueryService.findInProgressRequestsByAccount(100L))
                .thenReturn(List.of(request));

        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.ACCOUNT_CLOSURE_SUBMIT_APPLICATION,
            appUser,
            taskActionPayload);

        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        assertThat(request.getStatus()).isEqualTo(MrtmRequestStatus.CANCELLED);
        verify(requestAccountClosureService).applySubmitAction(requestTask, appUser);
        verify(workflowService).completeTask(processTaskId);
        verify(workflowService).deleteProcessInstance(
                null, "Workflow terminated by the system because the account was closed");
        verify(requestService).addActionToRequest(request, null, MrtmRequestActionType.REQUEST_TERMINATED, null);

        verifyNoMoreInteractions(requestAccountClosureService, workflowService,
                requestTaskService, requestService, requestQueryService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).isEqualTo(
                List.of(MrtmRequestTaskActionType.ACCOUNT_CLOSURE_SUBMIT_APPLICATION));
    }
}
