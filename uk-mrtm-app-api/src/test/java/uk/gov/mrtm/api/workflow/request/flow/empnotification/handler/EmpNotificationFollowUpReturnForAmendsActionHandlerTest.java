package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationValidatorService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpReturnForAmendsActionHandlerTest {

    @InjectMocks
    private EmpNotificationFollowUpReturnForAmendsActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestService requestService;

    @Mock
    private EmpNotificationValidatorService validator;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        final AppUser pmrvUser = AppUser.builder().userId("userId").build();
        final String processTaskId = "processTaskId";
        final UUID file = UUID.randomUUID();

        final EmpNotificationFollowUpReviewDecision reviewDecision = EmpNotificationFollowUpReviewDecision.builder()
            .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
            .details(
                EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                    .notes("notes")
                    .dueDate(LocalDate.of(2023, 3, 3))
                    .requiredChanges(Collections.singletonList(new ReviewDecisionRequiredChange("changes required", Set.of(file))))
                    .build()
            )
            .build();

        final EmpNotificationFollowUpApplicationReviewRequestTaskPayload taskPayload =
            EmpNotificationFollowUpApplicationReviewRequestTaskPayload.builder()
                .reviewDecision(reviewDecision)
                .followUpResponseExpirationDate(LocalDate.of(2023, 2, 2))
                .submissionDate(LocalDate.of(2023, 1, 1))
                .followUpAttachments(Map.of(file, "filename"))
                .sectionsCompleted(Map.of("section", "accepted"))
                .build();

        final String requestId = "requestId";
        final Request request = Request.builder().id(requestId).payload(EmpNotificationRequestPayload.builder().build()).build();
        final RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .processTaskId(processTaskId)
            .payload(taskPayload)
            .request(request)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_RETURN_FOR_AMENDS,
            pmrvUser,
            RequestTaskActionEmptyPayload.builder().build());

        // Verify
        assertThat(requestTaskPayload).isEqualTo(taskPayload);
        verify(requestTaskService).findTaskById(requestTask.getId());
        verify(validator).validateReturnForAmends(reviewDecision);
        verify(requestService).addActionToRequest(request,
            EmpNotificationFollowUpReturnedForAmendsRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS_PAYLOAD)
                .decisionDetails(
                    EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                        .notes(reviewDecision.getDetails().getNotes())
                        .dueDate(((EmpNotificationFollowupRequiredChangesDecisionDetails) reviewDecision.getDetails()).getDueDate())
                        .requiredChanges(((EmpNotificationFollowupRequiredChangesDecisionDetails) reviewDecision.getDetails()).getRequiredChanges())
                        .build()
                )
                .amendAttachments(Map.of(file, "filename"))
                .sectionsCompleted(Map.of("section", "accepted"))
                .build(),
            MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS,
            "userId");
        verify(workflowService).completeTask(processTaskId,
            Map.of(BpmnProcessConstants.REVIEW_OUTCOME, ReviewOutcome.AMENDS_NEEDED));

        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) requestTask.getRequest().getPayload();
        assertThat(requestPayload.getSectionsCompleted()).isEqualTo(Map.of());
        assertThat(requestPayload.getFollowUpReviewDecision()).isEqualTo(reviewDecision);
        assertThat(requestPayload.getFollowUpResponseAttachments()).isEqualTo(Map.of(file, "filename"));
        assertThat(requestPayload.getFollowUpReviewSectionsCompleted()).isEqualTo(Map.of("section", "accepted"));
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_RETURN_FOR_AMENDS);
    }
}