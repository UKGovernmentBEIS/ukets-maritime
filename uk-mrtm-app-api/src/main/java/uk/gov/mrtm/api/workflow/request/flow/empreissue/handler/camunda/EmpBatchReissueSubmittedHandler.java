package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueSubmittedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpBatchReissueSubmittedHandler implements JavaDelegate {

    private final EmpBatchReissueSubmittedService service;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        service.batchReissueSubmitted((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
