package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationOperatorLedApprovedGenerateDocumentsService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;


@Service
@RequiredArgsConstructor
public class EmpVariationApprovedGenerateDocumentsHandler implements JavaDelegate {

    private final EmpVariationOperatorLedApprovedGenerateDocumentsService service;


    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        service.generateDocuments((String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID));

    }
}
