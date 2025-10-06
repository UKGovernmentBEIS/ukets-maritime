package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationOperatorLedApprovedGenerateDocumentsService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;


@Service
@RequiredArgsConstructor
public class EmpVariationApprovedGenerateDocumentsHandlerFlowable implements JavaDelegate {

    private final EmpVariationOperatorLedApprovedGenerateDocumentsService service;


    @Override
    public void execute(DelegateExecution delegateExecution) {
        service.generateDocuments((String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID));

    }
}
