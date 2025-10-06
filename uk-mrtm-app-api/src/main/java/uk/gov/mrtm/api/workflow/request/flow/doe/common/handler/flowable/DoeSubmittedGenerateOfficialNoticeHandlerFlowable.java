package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.service.DoeOfficialNoticeGenerateService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class DoeSubmittedGenerateOfficialNoticeHandlerFlowable implements JavaDelegate {

    private final DoeOfficialNoticeGenerateService doeOfficialNoticeGenerateService;

    @Override
    public void execute(DelegateExecution execution) {
        String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        doeOfficialNoticeGenerateService.generateOfficialNotice(requestId);
    }
}
