package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.ExtendFollowUpExpirationTimerService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExtendFollowUpExpirationTimerHandlerTest {

    @InjectMocks
    private ExtendFollowUpExpirationTimerHandlerFlowable handler;

    @Mock
    private ExtendFollowUpExpirationTimerService service;

    @Test
    void execute() {

        final DelegateExecution execution = mock(DelegateExecution.class);
        final String requestId = "1";

        final Date expirationDate = new GregorianCalendar(2023, Calendar.FEBRUARY, 1).getTime();

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(execution.getVariable(MrtmBpmnProcessConstants.FOLLOW_UP_RESPONSE_EXPIRATION_DATE)).thenReturn(expirationDate);

        // Invoke
        handler.execute(execution);

        // Verify
        verify(service, times(1)).extendTimer(requestId, expirationDate);
    }

}
