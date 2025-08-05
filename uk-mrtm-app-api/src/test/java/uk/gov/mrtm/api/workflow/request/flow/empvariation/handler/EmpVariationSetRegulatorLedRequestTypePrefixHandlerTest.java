package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;


import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestCustomContext;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class EmpVariationSetRegulatorLedRequestTypePrefixHandlerTest {

    @InjectMocks
    private EmpVariationSetRegulatorLedRequestTypePrefixHandler cut;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() throws Exception {
        cut.execute(execution);

        verify(execution, times(1)).setVariable(BpmnProcessConstants.REQUEST_TYPE_DYNAMIC_TASK_PREFIX, MrtmRequestCustomContext.EMP_VARIATION_REGULATOR_LED.getCode());
    }
}
