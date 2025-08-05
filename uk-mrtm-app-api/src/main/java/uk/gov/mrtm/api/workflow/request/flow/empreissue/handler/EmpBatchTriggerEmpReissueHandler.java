package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpReissueCreateRequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpBatchTriggerEmpReissueHandler implements JavaDelegate {

    private final EmpReissueCreateRequestService empReissueCreateRequestService;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Long accountId = (Long) execution.getVariable(BpmnProcessConstants.ACCOUNT_ID);
        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        final String requestBusinessKey = (String) execution.getVariable(BpmnProcessConstants.BUSINESS_KEY);
        empReissueCreateRequestService.createReissueRequest(accountId, requestId, requestBusinessKey);
    }
}
