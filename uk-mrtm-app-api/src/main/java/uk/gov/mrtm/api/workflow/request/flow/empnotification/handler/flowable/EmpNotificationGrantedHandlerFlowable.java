package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationReviewSubmittedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpNotificationGrantedHandlerFlowable implements JavaDelegate {

    private final EmpNotificationReviewSubmittedService reviewSubmittedService;

    @Override
    public void execute(DelegateExecution execution) {
        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        reviewSubmittedService.executeGrantedPostActions(requestId);
		execution.setVariable(MrtmBpmnProcessConstants.FOLLOW_UP_RESPONSE_NEEDED,
				reviewSubmittedService.isFollowUpNeeded(requestId));
        
    }
}
