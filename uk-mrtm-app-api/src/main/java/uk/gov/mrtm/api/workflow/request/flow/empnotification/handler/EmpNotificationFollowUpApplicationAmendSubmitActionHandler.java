package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EmpNotificationFollowUpApplicationAmendSubmitActionHandler implements
    RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private final RequestTaskService requestTaskService;
    private final RequestService requestService;
    private final WorkflowService workflowService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final RequestTaskActionEmptyPayload actionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload taskPayload =
            (EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();
        
        // update request payload
        final Request request = requestTask.getRequest();
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();

        // The regulator has requested amends from the operator for the follow-up. The operator however, can complete
        // the amend of the notification follow-up without actually amending the response. In that case, the review
        // decision status and the regulator decision must remain unchanged. If however the operator applies changes to
        // their response and submits the amend completion, then the regulator follow-up review decision as well as the
        // status must be reset. This reset process is executed below.
        if (!Objects.equals(requestPayload.getFollowUpResponse(), taskPayload.getFollowUpResponse())
            ||
            !Objects.equals(requestPayload.getFollowUpResponseFiles(), taskPayload.getFollowUpFiles())) {
            requestPayload.setFollowUpReviewDecision(null);
            requestPayload.getFollowUpReviewSectionsCompleted().clear();
        }

        requestPayload.setFollowUpResponse(taskPayload.getFollowUpResponse());
        requestPayload.setFollowUpResponseFiles(taskPayload.getFollowUpFiles());
        requestPayload.setFollowUpResponseAttachments(taskPayload.getFollowUpAttachments());
        requestPayload.setAmendsSectionsCompleted(taskPayload.getSectionsCompleted());

        // create timeline action
        requestService.addActionToRequest(
            requestTask.getRequest(),
            null,
            MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_AMENDS_SUBMITTED,
            appUser.getUserId());
            
        // complete task
        workflowService.completeTask(requestTask.getProcessTaskId());

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SUBMIT_APPLICATION_AMEND);
    }
}
