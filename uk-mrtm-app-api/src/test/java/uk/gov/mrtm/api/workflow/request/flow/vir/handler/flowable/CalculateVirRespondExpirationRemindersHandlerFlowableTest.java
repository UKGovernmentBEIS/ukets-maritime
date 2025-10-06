package uk.gov.mrtm.api.workflow.request.flow.vir.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestExpirationType;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.CalculateRespondToRegulatorCommentsExpirationDateService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestExpirationVarsBuilder;

import java.util.Date;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CalculateVirRespondExpirationRemindersHandlerFlowableTest {

    @InjectMocks
    private CalculateVirRespondExpirationRemindersHandlerFlowable handler;

    @Mock
    private CalculateRespondToRegulatorCommentsExpirationDateService calculateRespondToRegulatorCommentsExpirationDateService;

    @Mock
    private RequestExpirationVarsBuilder requestExpirationVarsBuilder;

    @Test
    void execute() throws Exception {
        
        final DelegateExecution execution = mock(DelegateExecution.class);
        final String requestId = "AEM-001";
        final Date expirationDate = new Date();
        final Map<String, Object> vars = Map.of(
                "var1", "val1"
        );

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(calculateRespondToRegulatorCommentsExpirationDateService.calculateExpirationDate(requestId))
                .thenReturn(expirationDate);
        when(requestExpirationVarsBuilder.buildExpirationVars(MrtmRequestExpirationType.VIR, expirationDate))
                .thenReturn(vars);

        // Invoke
        handler.execute(execution);

        // Verify
        verify(execution, times(1)).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(calculateRespondToRegulatorCommentsExpirationDateService, times(1))
                .calculateExpirationDate(requestId);
        verify(requestExpirationVarsBuilder, times(1))
                .buildExpirationVars(MrtmRequestExpirationType.VIR, expirationDate);
        verify(execution, times(1)).setVariables(vars);
    }
}
