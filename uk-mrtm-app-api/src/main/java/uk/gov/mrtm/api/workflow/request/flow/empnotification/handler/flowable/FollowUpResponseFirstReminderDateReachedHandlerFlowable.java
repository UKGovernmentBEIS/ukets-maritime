package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationFollowUpSendReminderNotificationService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class FollowUpResponseFirstReminderDateReachedHandlerFlowable implements JavaDelegate {

    private final EmpNotificationFollowUpSendReminderNotificationService sendReminderNotificationService;

    @Override
    public void execute(DelegateExecution delegateExecution) {

        final String requestId = (String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID);
        final Date expirationDate = (Date) delegateExecution.getVariable(MrtmBpmnProcessConstants.FOLLOW_UP_RESPONSE_EXPIRATION_DATE);

        sendReminderNotificationService.sendFirstReminderNotification(requestId, expirationDate);
    }
}
