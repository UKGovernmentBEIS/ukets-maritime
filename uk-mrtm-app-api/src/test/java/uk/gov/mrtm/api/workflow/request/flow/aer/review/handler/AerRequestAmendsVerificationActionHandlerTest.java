package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerOutcome;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.service.RequestAerReviewService;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestCustomContext;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerRequestAmendsVerificationActionHandlerTest {

    @InjectMocks
    private AerRequestAmendsVerificationActionHandler amendsVerificationActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestAerReviewService requestAerReviewService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String requestTaskActionType = MrtmRequestTaskActionType.AER_REQUEST_AMENDS_VERIFICATION;
        AppUser appUser = AppUser.builder().build();
        RequestTaskActionEmptyPayload taskActionPayload =
            RequestTaskActionEmptyPayload.builder().build();

        String requestId = "REQ-ID";
        String processTaskId = "processTaskId";
        Request request = Request.builder().id(requestId).build();
        RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .request(request)
            .processTaskId(processTaskId)
            .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        amendsVerificationActionHandler.process(requestTaskId, requestTaskActionType, appUser, taskActionPayload);

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(requestAerReviewService, times(1))
            .sendAmendedAerToVerifier(requestTask, appUser);
        verify(workflowService, times(1)).completeTask(processTaskId,
            Map.of(BpmnProcessConstants.REQUEST_ID, requestId,
                MrtmBpmnProcessConstants.AER_OUTCOME, AerOutcome.VERIFICATION_REQUESTED,
                BpmnProcessConstants.REQUEST_TYPE_DYNAMIC_TASK_PREFIX, MrtmRequestCustomContext.AER_AMEND.getCode())
        );
    }

    @Test
    void getTypes() {
        assertThat(amendsVerificationActionHandler.getTypes())
            .containsOnly(MrtmRequestTaskActionType.AER_REQUEST_AMENDS_VERIFICATION);
    }
}