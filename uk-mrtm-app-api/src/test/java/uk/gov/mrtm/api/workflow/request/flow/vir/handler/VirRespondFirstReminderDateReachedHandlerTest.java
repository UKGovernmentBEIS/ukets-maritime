package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirSendReminderNotificationService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.util.Date;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VirRespondFirstReminderDateReachedHandlerTest {

    @InjectMocks
    private VirRespondFirstReminderDateReachedHandler handler;

    @Mock
    private VirSendReminderNotificationService service;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() throws Exception {
        
        final String requestId = "1";
        
        final Date date = new Date(); 
        
        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(execution.getVariable(MrtmBpmnProcessConstants.VIR_EXPIRATION_DATE)).thenReturn(date);

        // Invoke
        handler.execute(execution);

        // Verify
        verify(execution, times(1)).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(service, times(1)).sendRespondFirstReminderNotification(requestId, date);
    }
}
