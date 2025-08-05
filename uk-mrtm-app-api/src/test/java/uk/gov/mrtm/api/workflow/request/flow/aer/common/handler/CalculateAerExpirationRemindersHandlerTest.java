package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestExpirationType;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestExpirationVarsBuilder;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CalculateAerExpirationRemindersHandlerTest {

    @InjectMocks
    private CalculateAerExpirationRemindersHandler handler;

    @Mock
    private RequestExpirationVarsBuilder requestExpirationVarsBuilder;

    @Test
    void execute() {
        final DelegateExecution execution = mock(DelegateExecution.class);
        final Date expirationDate = new Date(2025, Calendar.MARCH, 31, 0, 0);

        final Map<String, Object> vars = Map.of(
            "var1", "val1",
            "aerSubmissionWindowReminderDate", new Date(2025, Calendar.JANUARY, 1, 0, 0)
        );

        when(execution.getVariable(MrtmBpmnProcessConstants.AER_EXPIRATION_DATE)).thenReturn(expirationDate);
        when(requestExpirationVarsBuilder.buildExpirationVars(MrtmRequestExpirationType.AER, expirationDate))
            .thenReturn(vars);

        // Invoke
        handler.execute(execution);

        // Verify
        verify(execution, times(1)).getVariable(MrtmBpmnProcessConstants.AER_EXPIRATION_DATE);
        verify(requestExpirationVarsBuilder, times(1))
            .buildExpirationVars(MrtmRequestExpirationType.AER, expirationDate);
        verify(execution, times(1)).setVariables(vars);
        verifyNoMoreInteractions(requestExpirationVarsBuilder);
    }
}
