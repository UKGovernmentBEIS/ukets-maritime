package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReturnedForAmendsRequestActionPayload;
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
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EmpNotificationFollowUpReturnForAmendsActionHandler implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private final RequestTaskService requestTaskService;
    private final EmpNotificationValidatorService validatorService;
    private final RequestService requestService;
    private final WorkflowService workflowService;

    @Override
    @Transactional
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final RequestTaskActionEmptyPayload payload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final EmpNotificationFollowUpApplicationReviewRequestTaskPayload taskPayload =
            (EmpNotificationFollowUpApplicationReviewRequestTaskPayload) requestTask.getPayload();

        validatorService.validateReturnForAmends(taskPayload.getReviewDecision());

        // update request payload
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) requestTask.getRequest().getPayload();
        requestPayload.setFollowUpReviewDecision(taskPayload.getReviewDecision());
        requestPayload.setFollowUpResponseAttachments(taskPayload.getFollowUpAttachments());
        requestPayload.setFollowUpReviewSectionsCompleted(taskPayload.getSectionsCompleted());

        // create timeline action
        this.createRequestAction(requestTask.getRequest(), appUser, taskPayload);

        final Map<String, Object> variables = new HashMap<>();
        variables.put(BpmnProcessConstants.REVIEW_OUTCOME, ReviewOutcome.AMENDS_NEEDED);
        workflowService.completeTask(requestTask.getProcessTaskId(), variables);

        return requestTask.getPayload();
    }

    private void createRequestAction(final Request request,
        final AppUser appUser,
        final EmpNotificationFollowUpApplicationReviewRequestTaskPayload taskPayload) {

        final EmpNotificationFollowupRequiredChangesDecisionDetails reviewDecisionDetails =
            (EmpNotificationFollowupRequiredChangesDecisionDetails) taskPayload.getReviewDecision().getDetails();
        final Set<UUID> files = reviewDecisionDetails.getRequiredChanges().stream().map(ReviewDecisionRequiredChange::getFiles).flatMap(Set::stream)
            .collect(Collectors.toSet());
        final Map<UUID, String> amendAttachments = taskPayload.getFollowUpAttachments().entrySet().stream()
            .filter(f -> files.contains(f.getKey())).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        final EmpNotificationFollowUpReturnedForAmendsRequestActionPayload actionPayload =
            EmpNotificationFollowUpReturnedForAmendsRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS_PAYLOAD)
                .decisionDetails(
                    EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                        .notes(reviewDecisionDetails.getNotes())
                        .requiredChanges(reviewDecisionDetails.getRequiredChanges())
                        .dueDate(reviewDecisionDetails.getDueDate())
                        .build()
                )
                .amendAttachments(amendAttachments)
                .sectionsCompleted(taskPayload.getSectionsCompleted())
                .build();

        requestService.addActionToRequest(request,
            actionPayload,
            MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS,
            appUser.getUserId());
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_RETURN_FOR_AMENDS);
    }
}
