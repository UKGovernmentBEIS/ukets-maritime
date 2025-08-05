package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionPayloadTypes;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpApplicationAmendSubmitActionHandlerTest {


    @InjectMocks
    private EmpNotificationFollowUpApplicationAmendSubmitActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestService requestService;

    @Mock
    private WorkflowService workflowService;

    @ParameterizedTest
    @MethodSource("taskPayloadChangedScenarios")
    void process(String taskFollowUpResponse, String requestFollowUpResponse,
                 Set<UUID> taskFiles, Set<UUID> requestFiles, UUID uuid1) {
        Map<String, String> followUpReviewSectionsCompleted = new HashMap<>();
        followUpReviewSectionsCompleted.put("reviewDecision", null);

        final RequestTaskActionEmptyPayload taskActionPayload =
            RequestTaskActionEmptyPayload.builder()
                .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
                .build();
        final AppUser pmrvUser = AppUser.builder().userId("userId").build();
        final String processTaskId = "processTaskId";
        final UUID file = UUID.randomUUID();
        final EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload taskPayload =
            EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload.builder()
                .followUpResponse(taskFollowUpResponse)
                .followUpFiles(taskFiles)
                .followUpAttachments(Map.of(file, "filename"))
                .sectionsCompleted(Map.of("section1", "accepted"))
                .build();
        EmpNotificationFollowUpReviewDecision reviewDecision = EmpNotificationFollowUpReviewDecision.builder()
            .type(EmpNotificationFollowUpReviewDecisionType.ACCEPTED).build();
        final Request request =
            Request.builder().id("requestId").payload(EmpNotificationRequestPayload.builder()
                    .followUpResponse(requestFollowUpResponse)
                    .followUpResponseFiles(requestFiles)
                    .followUpReviewDecision(reviewDecision)
                    .build())
                .build();
        final RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .processTaskId(processTaskId)
            .payload(taskPayload)
            .request(request)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SUBMIT_APPLICATION_AMEND,
            pmrvUser,
            taskActionPayload);

        // Verify
        assertThat(requestTaskPayload).isEqualTo(taskPayload);
        verify(requestTaskService).findTaskById(requestTask.getId());
        verify(workflowService).completeTask(processTaskId);
        verify(requestService).addActionToRequest(request,
            null,
            MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_AMENDS_SUBMITTED,
            "userId");

        final EmpNotificationRequestPayload requestPayload =
            (EmpNotificationRequestPayload) requestTask.getRequest().getPayload();
        assertThat(requestPayload.getFollowUpResponse()).isEqualTo(taskFollowUpResponse);
        assertThat(requestPayload.getFollowUpResponseFiles()).isEqualTo(Set.of(uuid1));
        assertThat(requestPayload.getFollowUpResponseAttachments()).isEqualTo(Map.of(file, "filename"));
        assertThat(requestPayload.getFollowUpReviewDecision()).isEqualTo(null);
        assertThat(requestPayload.getFollowUpReviewSectionsCompleted()).isEmpty();
        assertThat(requestPayload.getAmendsSectionsCompleted()).isEqualTo(Map.of("section1", "accepted"));
    }

    private static Stream<Arguments> taskPayloadChangedScenarios() {
        UUID uuid1 = UUID.randomUUID();
        UUID uuid2 = UUID.randomUUID();
        return Stream.of(
            Arguments.of("a", "b", Set.of(uuid1), Set.of(uuid1), uuid1),
            Arguments.of("a", "a", Set.of(uuid1), Set.of(uuid2), uuid1)
        );
    }

    @Test
    void process_when_task_payload_has_not_changed() {
        UUID uuid = UUID.randomUUID();
        String taskFollowUpResponse = "a";
        String requestFollowUpResponse = "a";
        Set<UUID> taskFiles = Set.of(uuid);
        Set<UUID> requestFiles = Set.of(uuid);

        final RequestTaskActionEmptyPayload taskActionPayload =
            RequestTaskActionEmptyPayload.builder()
                .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
                .build();
        final AppUser pmrvUser = AppUser.builder().userId("userId").build();
        final String processTaskId = "processTaskId";
        final UUID file = UUID.randomUUID();
        final EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload taskPayload =
            EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload.builder()
                .followUpResponse(taskFollowUpResponse)
                .followUpFiles(taskFiles)
                .followUpAttachments(Map.of(file, "filename"))
                .sectionsCompleted(Map.of("section1", "accepted"))
                .build();
        EmpNotificationFollowUpReviewDecision reviewDecision = EmpNotificationFollowUpReviewDecision.builder()
            .type(EmpNotificationFollowUpReviewDecisionType.ACCEPTED).build();
        final Request request =
            Request.builder().id("requestId").payload(EmpNotificationRequestPayload.builder()
                .followUpResponse(requestFollowUpResponse)
                .followUpResponseFiles(requestFiles)
                    .followUpReviewDecision(reviewDecision)
                .build())
            .build();
        final RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .processTaskId(processTaskId)
            .payload(taskPayload)
            .request(request)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SUBMIT_APPLICATION_AMEND,
            pmrvUser,
            taskActionPayload);

        // Verify
        assertThat(requestTaskPayload).isEqualTo(taskPayload);
        verify(requestTaskService).findTaskById(requestTask.getId());
        verify(workflowService).completeTask(processTaskId);
        verify(requestService).addActionToRequest(request,
            null,
            MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_AMENDS_SUBMITTED,
            "userId");

        final EmpNotificationRequestPayload requestPayload =
            (EmpNotificationRequestPayload) requestTask.getRequest().getPayload();
        assertThat(requestPayload.getFollowUpResponse()).isEqualTo(taskFollowUpResponse);
        assertThat(requestPayload.getFollowUpResponseAttachments()).isEqualTo(Map.of(file, "filename"));
        assertThat(requestPayload.getFollowUpReviewDecision()).isEqualTo(reviewDecision);
        assertThat(requestPayload.getFollowUpReviewSectionsCompleted()).isEqualTo(Map.of());
        assertThat(requestPayload.getAmendsSectionsCompleted()).isEqualTo(Map.of("section1", "accepted"));
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(
            MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SUBMIT_APPLICATION_AMEND);
    }
}
