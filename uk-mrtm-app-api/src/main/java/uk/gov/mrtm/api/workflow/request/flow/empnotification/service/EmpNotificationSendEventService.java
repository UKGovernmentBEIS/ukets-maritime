package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestExpirationType;
import uk.gov.netz.api.common.utils.DateUtils;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestExpirationVarsBuilder;

import java.time.LocalDate;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmpNotificationSendEventService {

    private final WorkflowService workflowService;
    private final RequestExpirationVarsBuilder requestExpirationVarsBuilder;

    public void extendTimer(final String requestId, final LocalDate dueDate) {
        final Map<String, Object> variables = requestExpirationVarsBuilder
                .buildExpirationVars(MrtmRequestExpirationType.FOLLOW_UP_RESPONSE, DateUtils.atEndOfDay(dueDate));

        workflowService.sendEvent(requestId, MrtmBpmnProcessConstants.FOLLOW_UP_TIMER_EXTENDED, variables);
    }
    
}
