package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.service.DoeAddCancelledRequestActionService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class DoeAddCancelledRequestActionHandler implements JavaDelegate {

	private final DoeAddCancelledRequestActionService doeAddCancelledRequestActionService;
	
	@Override
	public void execute(DelegateExecution execution) throws Exception {
		final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
		doeAddCancelledRequestActionService.add(requestId);
	}
}
