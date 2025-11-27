package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpReissueCompletedService;
import uk.gov.netz.api.workflow.bpmn.flowable.FlowableWorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpReissueCompletedHandlerFlowableTest {

	@InjectMocks
    private EmpReissueCompletedHandlerFlowable cut;
	
	@Mock
	private FlowableWorkflowService workflowService;
	
	@Mock
	private RequestQueryService requestQueryService;

    @Mock
    private EmpReissueCompletedService service;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() {
        String batchRequestBk = "1";
        String batchRequestProcessInstanceId = "2";
        String batchRequestId = "3";
        Long accountId = 4l;
        boolean reissueSucceeded = true;
        Request request = Request.builder().id(batchRequestId).processInstanceId(batchRequestProcessInstanceId).build();
        
        when(execution.getVariable(MrtmBpmnProcessConstants.EMP_BATCH_REQUEST_BUSINESS_KEY)).thenReturn(batchRequestBk);
        when(workflowService.getProcessInstanceIdByBusinessKey(batchRequestBk)).thenReturn(batchRequestProcessInstanceId);
        when(requestQueryService.findByProcessInstanceId(batchRequestProcessInstanceId)).thenReturn(request);
        when(execution.getVariable(BpmnProcessConstants.ACCOUNT_ID)).thenReturn(accountId);
        when(execution.getVariable(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED)).thenReturn(reissueSucceeded);
        
        cut.execute(execution);
        
        verify(execution, times(1)).getVariable(MrtmBpmnProcessConstants.EMP_BATCH_REQUEST_BUSINESS_KEY);
        verify(workflowService, times(1)).getProcessInstanceIdByBusinessKey(batchRequestBk);
        verify(requestQueryService, times(1)).findByProcessInstanceId(batchRequestProcessInstanceId);
        verify(execution, times(1)).getVariable(BpmnProcessConstants.ACCOUNT_ID);
        verify(execution, times(1)).getVariable(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED);
        verify(service, times(1)).reissueCompleted(batchRequestId, accountId, reissueSucceeded, true);
    }
    
}
