package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
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
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.List;


@RequiredArgsConstructor
@Component
public class EmpNotificationFollowUpSubmitResponseActionHandler implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private final RequestTaskService requestTaskService;
    private final EmpNotificationValidatorService validatorService;
    private final RequestService requestService;
    private final WorkflowService workflowService;


    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final RequestTaskActionEmptyPayload taskActionPayload) {

        // validate task payload
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final EmpNotificationFollowUpRequestTaskPayload taskPayload =
                (EmpNotificationFollowUpRequestTaskPayload) requestTask.getPayload();
        validatorService.validateFollowUpResponse(taskPayload);

        // update request payload
        final Request request = requestTask.getRequest();
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        requestPayload.setFollowUpResponse(taskPayload.getFollowUpResponse());
        requestPayload.setFollowUpResponseFiles(taskPayload.getFollowUpFiles());
        requestPayload.setFollowUpResponseAttachments(taskPayload.getFollowUpAttachments());
        requestPayload.setFollowUpSectionsCompleted(taskPayload.getSectionsCompleted());

        // create timeline action
        final EmpNotificationFollowUpResponseSubmittedRequestActionPayload actionPayload =
                EmpNotificationFollowUpResponseSubmittedRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_FOLLOW_UP_RESPONSE_SUBMITTED_PAYLOAD)
                        .request(taskPayload.getFollowUpRequest())
                        .response(taskPayload.getFollowUpResponse())
                        .responseFiles(taskPayload.getFollowUpFiles())
                        .responseAttachments(taskPayload.getFollowUpAttachments())
                        .sectionsCompleted(taskPayload.getSectionsCompleted())
                        .build();

        requestService.addActionToRequest(request,
                actionPayload,
                MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_RESPONSE_SUBMITTED,
                requestPayload.getOperatorAssignee());

        // complete task and set follow up context
        workflowService.completeTask(requestTask.getProcessTaskId());

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SUBMIT_RESPONSE);
    }
}
