package uk.gov.mrtm.api.workflow.request.flow.vir.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirDeadlineService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class VirDeadlineDateReachedHandlerFlowable implements JavaDelegate {

    private final VirDeadlineService virDeadlineService;

    @Override
    public void execute(DelegateExecution execution) {
        
        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        virDeadlineService.sendDeadlineNotification(requestId);
    }
}
