package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationCancelledService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpNotificationApplicationCancelledHandlerFlowable implements JavaDelegate {

    private final EmpNotificationCancelledService service;

    @Override
    public void execute(DelegateExecution delegateExecution) {
        service.cancel((String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
