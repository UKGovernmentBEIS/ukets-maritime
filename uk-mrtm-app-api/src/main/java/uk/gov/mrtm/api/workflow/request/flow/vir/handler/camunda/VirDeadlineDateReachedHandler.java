package uk.gov.mrtm.api.workflow.request.flow.vir.handler.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirDeadlineService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class VirDeadlineDateReachedHandler implements JavaDelegate {

    private final VirDeadlineService virDeadlineService;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        
        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        virDeadlineService.sendDeadlineNotification(requestId);
    }
}
