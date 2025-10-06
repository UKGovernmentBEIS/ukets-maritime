package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationPopulateRequestMetadataService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpVariationApprovedPopulateRequestMetadataHandlerFlowable implements JavaDelegate {

    private final EmpVariationPopulateRequestMetadataService service;

    @Override
    public void execute(DelegateExecution execution) {
        service.populateRequestMetadata((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID), false);
    }
}
