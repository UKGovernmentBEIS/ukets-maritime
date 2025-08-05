package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationSkipReviewRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerSkipReviewActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerSkipReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.service.RequestAerReviewService;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerSkipReviewActionHandlerTest {

    @InjectMocks
    private AerSkipReviewActionHandler skipReviewActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestAerReviewService requestAerReviewService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        AppUser user = AppUser.builder().build();
        AerApplicationSkipReviewRequestTaskActionPayload aerSkipReviewPayload = AerApplicationSkipReviewRequestTaskActionPayload.builder()
                .aerSkipReviewDecision(AerSkipReviewDecision.builder().type(AerSkipReviewActionType.OTHER).reason("reason").build())
                .build();
        AerRequestPayload requestPayload = AerRequestPayload.builder().verificationPerformed(true).build();
        Request request = Request.builder().id("REQ-ID").payload(requestPayload).build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        Aer aer = Aer.builder().build();
        AerApplicationReviewRequestTaskPayload expectedRequestTaskPayload =
                AerApplicationReviewRequestTaskPayload.builder()
                        .aer(aer)
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .build();
        String processTaskId = "processTaskId";
        RequestTask requestTask = RequestTask.builder()
                .id(requestTaskId)
                .request(request)
                .payload(AerApplicationReviewRequestTaskPayload.builder()
                    .aer(aer)
                    .reviewGroupDecisions(reviewGroupDecisions)
                    .build())
                .processTaskId(processTaskId)
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        RequestTaskPayload actualRequestTaskPayload = skipReviewActionHandler
            .process(requestTaskId, MrtmRequestTaskActionType.AER_SKIP_REVIEW, user, aerSkipReviewPayload);

        assertEquals(expectedRequestTaskPayload, actualRequestTaskPayload);

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(requestAerReviewService, times(1)).updateRequestPayloadWithSkipReviewOutcome(requestTask, aerSkipReviewPayload, user);
        verify(workflowService, times(1)).
                completeTask(processTaskId, Map.of(BpmnProcessConstants.REQUEST_ID, requestTask.getRequest().getId(),
                        MrtmBpmnProcessConstants.AER_REVIEW_OUTCOME, ReviewOutcome.SKIPPED));
    }

    @Test
    void getTypes() {
        assertThat(skipReviewActionHandler.getTypes()).containsOnly(MrtmRequestTaskActionType.AER_SKIP_REVIEW);
    }
}
