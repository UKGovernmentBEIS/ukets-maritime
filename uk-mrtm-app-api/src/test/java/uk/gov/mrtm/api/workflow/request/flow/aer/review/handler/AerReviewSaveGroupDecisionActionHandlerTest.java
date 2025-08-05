package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerSaveReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.service.RequestAerReviewService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerReviewSaveGroupDecisionActionHandlerTest {

    @InjectMocks
    private AerReviewSaveGroupDecisionActionHandler saveGroupDecisionActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestAerReviewService reviewService;


    @Test
    void process() {
        Long requestTaskId = 1L;
        RequestTask requestTask = RequestTask.builder().id(requestTaskId).build();
        AerSaveReviewGroupDecisionRequestTaskActionPayload taskActionPayload =
                AerSaveReviewGroupDecisionRequestTaskActionPayload.builder().build();
        AppUser user = AppUser.builder().build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        //invoke
        saveGroupDecisionActionHandler
                .process(requestTaskId, MrtmRequestTaskActionType.AER_SAVE_REVIEW_GROUP_DECISION, user, taskActionPayload);

        //verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(reviewService, times(1)).saveReviewGroupDecision(taskActionPayload, requestTask);
    }

    @Test
    void getTypes() {
        assertThat(saveGroupDecisionActionHandler.getTypes()).containsOnly(MrtmRequestTaskActionType.AER_SAVE_REVIEW_GROUP_DECISION);
    }
}
