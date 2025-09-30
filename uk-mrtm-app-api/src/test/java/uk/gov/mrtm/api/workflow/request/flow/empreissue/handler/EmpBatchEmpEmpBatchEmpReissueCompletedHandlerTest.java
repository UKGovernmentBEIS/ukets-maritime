package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpReissueCompletedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpBatchEmpEmpBatchEmpReissueCompletedHandlerTest {

	@InjectMocks
    private EmpBatchEmpReissueCompletedHandler cut;

    @Mock
    private EmpReissueCompletedService service;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() throws Exception {
        String requestId = "1";
        Long accountId = 3L;
        boolean reissueSucceeded = true;
        Integer numberOfAccountsCompleted = 0;
        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(execution.getVariable(BpmnProcessConstants.ACCOUNT_ID)).thenReturn(accountId);
        when(execution.getVariable(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED)).thenReturn(reissueSucceeded);
        when(execution.getVariable(MrtmBpmnProcessConstants.BATCH_NUMBER_OF_ACCOUNTS_COMPLETED)).thenReturn(numberOfAccountsCompleted);

        cut.execute(execution);
        
        verify(execution, times(1)).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(execution, times(1)).getVariable(BpmnProcessConstants.ACCOUNT_ID);
        verify(execution, times(1)).getVariable(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED);
        verify(execution, times(1)).getVariable(MrtmBpmnProcessConstants.BATCH_NUMBER_OF_ACCOUNTS_COMPLETED);
        verify(execution, times(1)).setVariable(MrtmBpmnProcessConstants.BATCH_NUMBER_OF_ACCOUNTS_COMPLETED, 1);
        verify(service, times(1)).reissueCompleted(requestId, accountId, reissueSucceeded);
    }
    
}
