package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.camunda;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmpBatchEmpReissueCompletedHandler implements JavaDelegate {

	@Override
	public void execute(DelegateExecution execution) throws Exception {
		//TODO : totally remove whole class
	}

}