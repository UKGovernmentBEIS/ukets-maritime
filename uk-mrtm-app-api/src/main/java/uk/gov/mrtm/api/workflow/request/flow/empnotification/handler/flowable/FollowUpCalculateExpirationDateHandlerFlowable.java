package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestExpirationType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationReviewSubmittedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestExpirationVarsBuilder;

import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FollowUpCalculateExpirationDateHandlerFlowable implements JavaDelegate {

    private final RequestExpirationVarsBuilder requestExpirationVarsBuilder;
    private final EmpNotificationReviewSubmittedService reviewSubmittedService;

    @Override
    public void execute(DelegateExecution execution) {
        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        final Date expirationDate = reviewSubmittedService.resolveFollowUpExpirationDate(requestId);
        Map<String, Object> expirationVars = requestExpirationVarsBuilder
                .buildExpirationVars(MrtmRequestExpirationType.FOLLOW_UP_RESPONSE, expirationDate);
        execution.setVariables(expirationVars);
    }
}