package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirOfficialNoticeService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class VirGenerateOfficialNoticeHandler implements JavaDelegate {

    private final VirOfficialNoticeService virOfficialNoticeService;

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        
        final String requestId = (String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID);
        virOfficialNoticeService.generateAndSaveRecommendedImprovementsOfficialNotice(requestId);
    }
}
