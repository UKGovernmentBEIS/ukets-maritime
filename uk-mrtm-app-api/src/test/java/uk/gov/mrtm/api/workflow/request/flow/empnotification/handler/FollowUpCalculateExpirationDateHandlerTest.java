package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestExpirationType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationReviewSubmittedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestExpirationVarsBuilder;

import java.util.Date;
import java.util.Map;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FollowUpCalculateExpirationDateHandlerTest {

    @InjectMocks
    private FollowUpCalculateExpirationDateHandler cut;

    @Mock
    private RequestExpirationVarsBuilder requestExpirationVarsBuilder;

    @Mock
    private EmpNotificationReviewSubmittedService reviewSubmittedService;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() {
        String requestId = "1";
        Date expirationDate = new Date();
        Map<String, Object> expirationVars = Map.of(
                "var1", "val1"
        );

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(reviewSubmittedService.resolveFollowUpExpirationDate(requestId)).thenReturn(expirationDate);
        when(requestExpirationVarsBuilder.buildExpirationVars(MrtmRequestExpirationType.FOLLOW_UP_RESPONSE, expirationDate)).thenReturn(expirationVars);

        cut.execute(execution);

        verify(execution).setVariables(expirationVars);
        verify(execution).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(reviewSubmittedService).resolveFollowUpExpirationDate(requestId);
        verify(requestExpirationVarsBuilder).buildExpirationVars(MrtmRequestExpirationType.FOLLOW_UP_RESPONSE, expirationDate);
    }
}
