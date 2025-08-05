package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmpReissueMarkAsCompletedHandlerTest {
	
	@InjectMocks
    private EmpReissueMarkAsCompletedHandler cut;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() throws Exception {
        cut.execute(execution);
        verify(execution, times(1)).setVariable(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED, true);
    }
    
}
