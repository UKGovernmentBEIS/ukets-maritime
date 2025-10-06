package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.flowable;


import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationAddRegulatorLedApprovedRequestActionService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpVariationAddRegulatorLedApprovedRequestActionHandlerFlowable implements JavaDelegate {

    private final EmpVariationAddRegulatorLedApprovedRequestActionService service;

    @Override
    public void execute(DelegateExecution execution) {
        service.add((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
