package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.flowable;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueQueryService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@ExtendWith(MockitoExtension.class)
class EmpBatchReissuePopulateNumberOfAccountsCompletedHandlerFlowableTest {

	@InjectMocks
    private EmpBatchReissuePopulateNumberOfAccountsCompletedHandlerFlowable cut;

    @Mock
    private EmpBatchReissueQueryService empBatchReissueQueryService;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() {
        String requestId = "1";
        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(empBatchReissueQueryService.getNumberOfAccountsCompleted(requestId)).thenReturn(10L);

        cut.execute(execution);
        
        verify(empBatchReissueQueryService, times(1)).getNumberOfAccountsCompleted(requestId);
        verify(execution, times(1)).setVariable(MrtmBpmnProcessConstants.BATCH_NUMBER_OF_ACCOUNTS_COMPLETED, 10L);
    }
    
}
