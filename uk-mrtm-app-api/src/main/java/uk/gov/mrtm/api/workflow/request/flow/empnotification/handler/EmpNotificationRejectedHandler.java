package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationReviewSubmittedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpNotificationRejectedHandler implements JavaDelegate {

    private final EmpNotificationReviewSubmittedService service;

    @Override
    public void execute(DelegateExecution execution) {
        service.executeRejectedPostActions((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
