package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpExtendDateRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationSendEventService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class EmpNotificationFollowUpExtendDateActionHandler implements RequestTaskActionHandler<EmpNotificationFollowUpExtendDateRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final EmpNotificationSendEventService eventService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final EmpNotificationFollowUpExtendDateRequestTaskActionPayload actionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final LocalDate previousDueDate = requestTask.getDueDate();
        final LocalDate dueDate = actionPayload.getDueDate();

        // validate
        if (!dueDate.isAfter(previousDueDate)) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }

        // send event
        final String requestId = requestTask.getRequest().getId();
        eventService.extendTimer(requestId, dueDate);

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_EXTEND_DATE);
    }
}
