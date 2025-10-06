package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSendReminderNotificationService;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AerFirstReminderDateReachedHandlerFlowable implements JavaDelegate {

    private final AerSendReminderNotificationService aerSendReminderNotificationService;

    @Override
    public void execute(DelegateExecution execution) {
        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        final Date expirationDate = (Date) execution.getVariable(MrtmBpmnProcessConstants.AER_EXPIRATION_DATE);

        aerSendReminderNotificationService.sendFirstReminderNotification(requestId, expirationDate);
    }
}
