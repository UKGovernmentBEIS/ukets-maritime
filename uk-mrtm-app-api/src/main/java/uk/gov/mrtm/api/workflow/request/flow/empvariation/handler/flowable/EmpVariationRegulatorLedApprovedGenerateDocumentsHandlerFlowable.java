package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationRegulatorLedApprovedGenerateDocumentsService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpVariationRegulatorLedApprovedGenerateDocumentsHandlerFlowable implements JavaDelegate {

    private final EmpVariationRegulatorLedApprovedGenerateDocumentsService service;

    @Override
    public void execute(DelegateExecution execution) {
        service.generateDocuments((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
