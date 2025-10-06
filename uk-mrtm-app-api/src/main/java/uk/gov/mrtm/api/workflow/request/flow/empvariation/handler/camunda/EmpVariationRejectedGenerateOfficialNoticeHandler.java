package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationOfficialNoticeService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpVariationRejectedGenerateOfficialNoticeHandler implements JavaDelegate {

    private final EmpVariationOfficialNoticeService service;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        service.generateAndSaveRejectedOfficialNotice((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
