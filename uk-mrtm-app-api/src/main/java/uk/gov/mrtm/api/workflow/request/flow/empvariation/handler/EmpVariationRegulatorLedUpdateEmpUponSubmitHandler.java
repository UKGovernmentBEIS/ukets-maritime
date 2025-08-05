package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;


import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationUpdateEmpService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpVariationRegulatorLedUpdateEmpUponSubmitHandler implements JavaDelegate {

    private final EmpVariationUpdateEmpService empVariationUpdateEmpService;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        empVariationUpdateEmpService.updateEmp(requestId);
    }
}
