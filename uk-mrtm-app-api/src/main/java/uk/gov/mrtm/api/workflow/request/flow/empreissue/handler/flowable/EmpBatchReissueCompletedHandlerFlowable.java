package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueCompletedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpBatchReissueCompletedHandlerFlowable implements JavaDelegate {

	private final EmpBatchReissueCompletedService service;
	
	@Override
	public void execute(DelegateExecution execution) {
		service.addAction((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
	}
	
}
