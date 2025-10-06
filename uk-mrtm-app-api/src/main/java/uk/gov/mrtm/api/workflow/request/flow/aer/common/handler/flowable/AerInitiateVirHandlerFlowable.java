package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerCreateVirService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class AerInitiateVirHandlerFlowable implements JavaDelegate {

    private final AerCreateVirService service;

    @Override
    public void execute(DelegateExecution delegateExecution) {

        final String requestId = (String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID);
        service.createRequestVir(requestId);
    }
}
