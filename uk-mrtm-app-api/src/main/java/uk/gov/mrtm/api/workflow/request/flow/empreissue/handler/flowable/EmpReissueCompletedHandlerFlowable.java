package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.flowable;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpReissueCompletedService;
import uk.gov.netz.api.workflow.bpmn.flowable.FlowableWorkflowService;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Log4j2
@Service
@RequiredArgsConstructor
public class EmpReissueCompletedHandlerFlowable implements JavaDelegate {

	private final FlowableWorkflowService workflowService;
	private final RequestQueryService requestQueryService;
	private final EmpReissueCompletedService service;
	
	@Override
	public void execute(DelegateExecution execution) {
		final String batchRequestBk = (String) execution.getVariable(MrtmBpmnProcessConstants.EMP_BATCH_REQUEST_BUSINESS_KEY);
		final String batchProcessInstanceId = workflowService.getProcessInstanceIdByBusinessKey(batchRequestBk);
		
		final String batchRequestId = requestQueryService.findByProcessInstanceId(batchProcessInstanceId).getId();
		
		final Long accountId = (Long)execution.getVariable(BpmnProcessConstants.ACCOUNT_ID);
		final boolean reissueSucceeded = (Boolean)execution.getVariable(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED);
		
		service.reissueCompleted(batchRequestId, accountId, reissueSucceeded, true);
	}

}