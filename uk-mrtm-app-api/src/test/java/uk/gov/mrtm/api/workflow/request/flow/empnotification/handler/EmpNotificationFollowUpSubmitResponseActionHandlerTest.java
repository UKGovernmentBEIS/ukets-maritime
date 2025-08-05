package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpResponseSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationValidatorService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpSubmitResponseActionHandlerTest {

    @InjectMocks
    private EmpNotificationFollowUpSubmitResponseActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestService requestService;

    @Mock
    private EmpNotificationValidatorService validatorService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {

        final AppUser appUser = AppUser.builder().userId("userId").build();
        final String processTaskId = "processTaskId";
        final UUID file = UUID.randomUUID();
        final EmpNotificationFollowUpRequestTaskPayload taskPayload =
                EmpNotificationFollowUpRequestTaskPayload.builder()
                        .followUpResponse("the response")
                        .followUpFiles(Set.of(file))
                        .followUpAttachments(Map.of(file, "filename"))
                        .build();
        final String requestId = "requestId";
        final Request request =
                Request.builder().id(requestId).payload(EmpNotificationRequestPayload.builder()
                                .operatorAssignee("operator")
                                .build())
                        .build();
        final RequestTask requestTask = RequestTask.builder()
                .id(1L)
                .processTaskId(processTaskId)
                .payload(taskPayload)
                .request(request)
                .build();
        final EmpNotificationFollowUpResponseSubmittedRequestActionPayload actionPayload =
                EmpNotificationFollowUpResponseSubmittedRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_FOLLOW_UP_RESPONSE_SUBMITTED_PAYLOAD)
                        .response("the response")
                        .responseFiles(Set.of(file))
                        .responseAttachments(Map.of(file, "filename"))
                        .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_NOTIFICATION_NOTIFY_OPERATOR_FOR_DECISION,
            appUser,
            RequestTaskActionEmptyPayload.builder().build());

        // Verify
        assertThat(requestTaskPayload).isEqualTo(taskPayload);
        verify(requestTaskService).findTaskById(requestTask.getId());
        verify(validatorService).validateFollowUpResponse(taskPayload);
        verify(requestService).addActionToRequest(request,
                actionPayload,
                MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_RESPONSE_SUBMITTED,
                "operator");
        verify(workflowService).completeTask(processTaskId);

        final EmpNotificationRequestPayload requestPayload =
                (EmpNotificationRequestPayload) requestTask.getRequest().getPayload();
        assertThat(requestPayload.getFollowUpResponse()).isEqualTo("the response");
        assertThat(requestPayload.getFollowUpResponseFiles()).isEqualTo(Set.of(file));
        assertThat(requestPayload.getFollowUpResponseAttachments()).isEqualTo(Map.of(file, "filename"));
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(
                MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SUBMIT_RESPONSE);
    }
}
