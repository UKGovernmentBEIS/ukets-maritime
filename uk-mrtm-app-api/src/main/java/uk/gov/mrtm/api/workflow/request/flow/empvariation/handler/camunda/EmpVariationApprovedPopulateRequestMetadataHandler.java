package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationPopulateRequestMetadataService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpVariationApprovedPopulateRequestMetadataHandler implements JavaDelegate {

    private final EmpVariationPopulateRequestMetadataService service;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        service.populateRequestMetadata((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID), false);
    }
}
