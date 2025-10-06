package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueSubmittedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpBatchReissueSubmittedHandlerFlowable implements JavaDelegate {

    private final EmpBatchReissueSubmittedService service;

    @Override
    public void execute(DelegateExecution execution) {
        service.batchReissueSubmitted((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
