package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerCreateVirService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class AerInitiateVirHandler implements JavaDelegate {

    private final AerCreateVirService service;

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {

        final String requestId = (String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID);
        service.createRequestVir(requestId);
    }
}
