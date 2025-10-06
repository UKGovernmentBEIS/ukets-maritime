package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationRegulatorLedApprovedGenerateDocumentsService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpVariationRegulatorLedApprovedGenerateDocumentsHandler implements JavaDelegate {

    private final EmpVariationRegulatorLedApprovedGenerateDocumentsService service;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        service.generateDocuments((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
