package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpSaveApplicationAmendRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpNotificationFollowUpSaveApplicationAmendActionHandler implements
    RequestTaskActionHandler<EmpNotificationFollowUpSaveApplicationAmendRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final EmpNotificationFollowUpSaveApplicationAmendRequestTaskActionPayload actionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload taskPayload =
            (EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();

        taskPayload.setFollowUpResponse(actionPayload.getResponse());
        taskPayload.setFollowUpFiles(actionPayload.getFiles());
        taskPayload.setSectionsCompleted(actionPayload.getSectionsCompleted());

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SAVE_APPLICATION_AMEND);
    }
}
