package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.EmpIssuanceGrantedGenerateDocumentsService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpIssuanceGrantedGenerateDocumentsHandler implements JavaDelegate {

    private final EmpIssuanceGrantedGenerateDocumentsService empIssuanceGrantedGenerateDocumentsService;

    @Override
    public void execute(DelegateExecution execution) {
        empIssuanceGrantedGenerateDocumentsService.generateDocuments((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
