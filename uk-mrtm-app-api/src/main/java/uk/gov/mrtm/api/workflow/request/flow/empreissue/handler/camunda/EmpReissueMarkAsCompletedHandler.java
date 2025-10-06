package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.camunda;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;

@Service
public class EmpReissueMarkAsCompletedHandler implements JavaDelegate {

	@Override
	public void execute(DelegateExecution execution) throws Exception {
		execution.setVariable(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED, true);
	}

}
