package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper.AerReviewMapper;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.service.RequestAerReviewService;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.validation.RequestAerReviewValidatorService;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerReviewReturnForAmendsActionHandlerTest {

    @InjectMocks
    private AerReviewReturnForAmendsActionHandler returnForAmendsActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestAerReviewService aerReviewService;

    @Mock
    private RequestAerReviewValidatorService aerReviewValidatorService;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private AerReviewMapper aerReviewMapper;

    @Test
    void process() {
        Long requestTaskId = 1L;
        AppUser user = AppUser.builder().userId("userId").build();
        RequestTaskActionEmptyPayload taskActionEmptyPayload = RequestTaskActionEmptyPayload.builder().build();

        AerRequestPayload requestPayload = mock(AerRequestPayload.class);
        Request request = Request.builder().id("REQ-ID").payload(requestPayload).build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        Aer aer = Aer.builder().build();
        AerApplicationReviewRequestTaskPayload requestTaskPayload =
            AerApplicationReviewRequestTaskPayload.builder()
                .aer(aer)
                .reviewGroupDecisions(reviewGroupDecisions)
                .build();
        String processTaskId = "processTaskId";
        RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .request(request)
            .payload(requestTaskPayload)
            .processTaskId(processTaskId)
            .build();

        AerApplicationReturnedForAmendsRequestActionPayload returnedForAmendsRequestActionPayload =
            AerApplicationReturnedForAmendsRequestActionPayload.builder().build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);
        when(aerReviewMapper
            .toAerApplicationReturnedForAmendsRequestActionPayload(requestTaskPayload, MrtmRequestActionPayloadType.AER_APPLICATION_RETURNED_FOR_AMENDS_PAYLOAD))
            .thenReturn(returnedForAmendsRequestActionPayload);

        RequestTaskPayload actualRequestTaskPayload = returnForAmendsActionHandler.process(requestTaskId,
            MrtmRequestTaskActionType.AER_REVIEW_RETURN_FOR_AMENDS, user, taskActionEmptyPayload);

        assertEquals(requestTaskPayload, actualRequestTaskPayload);

        verify(requestTaskService).findTaskById(requestTaskId);
        verify(aerReviewValidatorService).validateAtLeastOneReviewGroupAmendsNeeded(requestTaskPayload);
        verify(aerReviewService).updateRequestPayloadWithReviewOutcome(requestTask, user);
        verify(aerReviewService).removeAmendRequestedChangesSubtaskStatus(requestPayload);
        verify(aerReviewMapper).toAerApplicationReturnedForAmendsRequestActionPayload(requestTaskPayload,
                MrtmRequestActionPayloadType.AER_APPLICATION_RETURNED_FOR_AMENDS_PAYLOAD);
        verify(aerReviewMapper).toAerApplicationReturnedForAmendsRequestActionPayload(requestTaskPayload,
                MrtmRequestActionPayloadType.AER_APPLICATION_RETURNED_FOR_AMENDS_PAYLOAD);
        verify(requestService).addActionToRequest(
            request, returnedForAmendsRequestActionPayload, MrtmRequestActionType.AER_APPLICATION_RETURNED_FOR_AMENDS, user.getUserId());
        verify(workflowService).completeTask(
            processTaskId, Map.of(MrtmBpmnProcessConstants.AER_REVIEW_OUTCOME, ReviewOutcome.AMENDS_NEEDED));
        verifyNoMoreInteractions(requestTaskService, requestService, aerReviewService,
            aerReviewValidatorService, workflowService, aerReviewMapper);
    }

    @Test
    void getTypes() {
        assertThat(returnForAmendsActionHandler.getTypes()).containsOnly(MrtmRequestTaskActionType.AER_REVIEW_RETURN_FOR_AMENDS);
    }
}