package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpReissueCompletedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpBatchEmpReissueCompletedHandler implements JavaDelegate {

	private final EmpReissueCompletedService service;
	
	@Override
	public void execute(DelegateExecution execution) throws Exception {
		final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
		final Long accountId = (Long) execution.getVariable(BpmnProcessConstants.ACCOUNT_ID);
		final boolean reissueSucceeded = (boolean) execution.getVariable(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED);
		
		service.reissueCompleted(requestId, accountId, reissueSucceeded, false);
		
		//increment completed number var
		final Integer numberOfAccountsCompleted = (Integer) execution.getVariable(MrtmBpmnProcessConstants.BATCH_NUMBER_OF_ACCOUNTS_COMPLETED);
		execution.setVariable(MrtmBpmnProcessConstants.BATCH_NUMBER_OF_ACCOUNTS_COMPLETED, numberOfAccountsCompleted + 1);
	}

}