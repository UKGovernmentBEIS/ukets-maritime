package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.service.DoeOfficialNoticeGenerateService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class DoeSubmittedGenerateOfficialNoticeHandler implements JavaDelegate {

    private final DoeOfficialNoticeGenerateService doeOfficialNoticeGenerateService;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        doeOfficialNoticeGenerateService.generateOfficialNotice(requestId);
    }
}
