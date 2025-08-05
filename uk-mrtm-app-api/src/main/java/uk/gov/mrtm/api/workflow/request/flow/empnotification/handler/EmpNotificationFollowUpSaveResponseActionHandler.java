package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpSaveResponseRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RequiredArgsConstructor
@Component
public class EmpNotificationFollowUpSaveResponseActionHandler implements RequestTaskActionHandler<EmpNotificationFollowUpSaveResponseRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final EmpNotificationFollowUpSaveResponseRequestTaskActionPayload actionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final EmpNotificationFollowUpRequestTaskPayload taskPayload =
                (EmpNotificationFollowUpRequestTaskPayload) requestTask.getPayload();

        final String response = actionPayload.getResponse();
        final Set<UUID> files = actionPayload.getFiles();

        taskPayload.setFollowUpResponse(response);
        taskPayload.setFollowUpFiles(files);
        taskPayload.setSectionsCompleted(actionPayload.getSectionsCompleted());

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SAVE_RESPONSE);
    }
    
}
