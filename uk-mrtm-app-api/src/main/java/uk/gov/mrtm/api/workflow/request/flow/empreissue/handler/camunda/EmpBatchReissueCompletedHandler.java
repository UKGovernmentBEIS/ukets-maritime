package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueCompletedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpBatchReissueCompletedHandler implements JavaDelegate {

	private final EmpBatchReissueCompletedService service;
	
	@Override
	public void execute(DelegateExecution execution) throws Exception {
		service.addAction((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
	}
	
}
