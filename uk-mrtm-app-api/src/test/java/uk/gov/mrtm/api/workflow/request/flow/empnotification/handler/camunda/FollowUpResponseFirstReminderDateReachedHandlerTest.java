package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler.camunda;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationFollowUpSendReminderNotificationService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.util.Date;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FollowUpResponseFirstReminderDateReachedHandlerTest {

    @InjectMocks
    private FollowUpResponseFirstReminderDateReachedHandler handler;

    @Mock
    private EmpNotificationFollowUpSendReminderNotificationService sendReminderNotificationService;

    @Test
    void execute() {

        final DelegateExecution delegateExecution = mock(DelegateExecution.class);
        final String requestId = "1";
        final Date expirationDate = new Date();

        when(delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(delegateExecution.getVariable(MrtmBpmnProcessConstants.FOLLOW_UP_RESPONSE_EXPIRATION_DATE)).thenReturn(expirationDate);

        handler.execute(delegateExecution);

        verify(sendReminderNotificationService, times(1)).sendFirstReminderNotification(requestId, expirationDate);
    }
}
