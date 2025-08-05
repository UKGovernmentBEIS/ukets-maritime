package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSubmitOutcome;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationSubmitRegulatorLedService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.validator.EmpVariationNotifyOperatorRegulatorLedValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.NotifyOperatorForDecisionRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;

import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmpVariationNotifyOperatorRegulatorLedActionHandlerTest {

    @InjectMocks
    private EmpVariationNotifyOperatorRegulatorLedActionHandler cut;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private EmpVariationSubmitRegulatorLedService empVariationSubmitRegulatorLedService;

    @Mock
    private EmpVariationNotifyOperatorRegulatorLedValidator validator;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String requestTaskActionType = MrtmRequestTaskActionType.EMP_VARIATION_NOTIFY_OPERATOR_FOR_DECISION_REGULATOR_LED;
        AppUser appUser = AppUser.builder().userId("userId").build();
        NotifyOperatorForDecisionRequestTaskActionPayload payload = NotifyOperatorForDecisionRequestTaskActionPayload.builder()
                .decisionNotification(DecisionNotification.builder()
                        .operators(Set.of("op1"))
                        .build())
                .build();

        Request request = Request.builder().id("requestId").build();
        RequestTask requestTask = RequestTask.builder()
                .id(requestTaskId)
                .processTaskId("process-task-id")
                .request(request)
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        cut.process(requestTaskId, requestTaskActionType, appUser, payload);

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(validator, times(1)).validate(requestTask, payload, appUser);
        verify(empVariationSubmitRegulatorLedService, times(1)).saveDecisionNotification(requestTask,
                payload.getDecisionNotification(), appUser);
        verify(workflowService, times(1)).completeTask(requestTask.getProcessTaskId(),
                Map.of(BpmnProcessConstants.REQUEST_ID, requestTask.getRequest().getId(),
                        MrtmBpmnProcessConstants.EMP_VARIATION_SUBMIT_OUTCOME, EmpVariationSubmitOutcome.SUBMITTED,
                        BpmnProcessConstants.REVIEW_OUTCOME, ReviewOutcome.NOTIFY_OPERATOR,
                        BpmnProcessConstants.SKIP_PAYMENT, true)
        );

        assertThat(request.getSubmissionDate()).isNotNull();
    }

    @Test
    void getTypes() {
        assertThat(cut.getTypes())
                .containsExactly(MrtmRequestTaskActionType.EMP_VARIATION_NOTIFY_OPERATOR_FOR_DECISION_REGULATOR_LED);
    }
}
