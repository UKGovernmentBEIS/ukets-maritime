package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationReviewNotifyOperatorValidatorService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationReviewService;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationReviewNotifyOperatorActionHandlerTest {

    @InjectMocks
    private EmpVariationReviewNotifyOperatorActionHandler notifyOperatorActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private EmpVariationReviewService empVariationReviewService;

    @Mock
    private EmpVariationReviewNotifyOperatorValidatorService reviewNotifyOperatorValidatorService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String requestId = "REQUEST-1";
        String requestTaskActionType = MrtmRequestTaskActionType.EMP_VARIATION_NOTIFY_OPERATOR_FOR_DECISION;
        AppUser appUser = AppUser.builder().build();
        DecisionNotification decisionNotification = DecisionNotification.builder().build();
        NotifyOperatorForDecisionRequestTaskActionPayload requestTaskActionPayload =
                NotifyOperatorForDecisionRequestTaskActionPayload.builder()
                        .decisionNotification(decisionNotification)
                        .build();
        EmpVariationDetermination determination = EmpVariationDetermination.builder().type(EmpVariationDeterminationType.APPROVED).build();
        EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder()
                        .determination(determination)
                        .build();
        Request request = Request.builder().id(requestId).build();
        RequestTask requestTask = RequestTask.builder()
                .id(requestTaskId)
                .processTaskId("process-task-id")
                .payload(requestTaskPayload)
                .request(request)
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        //invoke
        notifyOperatorActionHandler.process(requestTaskId, requestTaskActionType, appUser, requestTaskActionPayload);

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(empVariationReviewService,times(1))
                .saveDecisionNotification(requestTask, decisionNotification, appUser);
        verify(reviewNotifyOperatorValidatorService, times(1))
                .validate(requestTask, requestTaskActionPayload, appUser);
        verify(workflowService, times(1))
                .completeTask(requestTask.getProcessTaskId(), Map.of(
                        BpmnProcessConstants.REQUEST_ID, requestId,
                        BpmnProcessConstants.REVIEW_DETERMINATION, determination.getType(),
                        BpmnProcessConstants.REVIEW_OUTCOME, ReviewOutcome.NOTIFY_OPERATOR));
    }

    @Test
    void getTypes() {
        assertThat(notifyOperatorActionHandler.getTypes())
                .containsExactly(MrtmRequestTaskActionType.EMP_VARIATION_NOTIFY_OPERATOR_FOR_DECISION);
    }
}
