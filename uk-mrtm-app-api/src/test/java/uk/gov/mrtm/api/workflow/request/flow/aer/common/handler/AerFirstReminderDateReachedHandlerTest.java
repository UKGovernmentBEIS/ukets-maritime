package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSendReminderNotificationService;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.util.Date;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerFirstReminderDateReachedHandlerTest {

    @Mock
    private AerSendReminderNotificationService aerSendReminderNotificationService;

    @InjectMocks
    private AerFirstReminderDateReachedHandler aerFirstReminderDateReachedHandler;

    @Test
    public void execute() throws Exception {
        // Arrange
        DelegateExecution execution = mock(DelegateExecution.class);
        String requestId = "request-id";
        Date expirationDate = new Date();

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(execution.getVariable(MrtmBpmnProcessConstants.AER_EXPIRATION_DATE)).thenReturn(expirationDate);

        aerFirstReminderDateReachedHandler.execute(execution);

        verify(aerSendReminderNotificationService).sendFirstReminderNotification(requestId, expirationDate);
    }

}