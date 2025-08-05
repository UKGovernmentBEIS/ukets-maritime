package uk.gov.mrtm.api.workflow.request.flow.doe.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeSubmitOutcome;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.service.RequestDoeApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoeRequestPeerReviewActionHandlerTest {

    @InjectMocks
    private DoeRequestPeerReviewActionHandler peerReviewActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestDoeApplyService doeApplyService;

    @Mock
    private RequestService requestService;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;

    @Mock
    private RequestTaskTypeService requestTaskTypeService;

    @Test
    void process() {
        String requestId = "1";
        String peerReviewer = "peerReviewer";
        Long requestTaskId = 2L;
        String requestTaskActionType = MrtmRequestTaskActionType.DOE_REQUEST_PEER_REVIEW;
        AppUser appUser = AppUser.builder().userId("user").build();

        PeerReviewRequestTaskActionPayload taskActionPayload = PeerReviewRequestTaskActionPayload.builder()
            .payloadType(MrtmRequestTaskActionPayloadTypes.DOE_REQUEST_PEER_REVIEW_PAYLOAD)
            .peerReviewer(peerReviewer)
            .build();
        Request request = Request.builder().id(requestId).build();

        RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .processTaskId("processTaskId")
            .request(request)
            .build();

        final RequestTaskType requestTaskType = mock(RequestTaskType.class);

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);
        when(requestTaskTypeService.findByCode(MrtmRequestTaskType.DOE_APPLICATION_PEER_REVIEW))
                .thenReturn(requestTaskType);

        peerReviewActionHandler.process(requestTaskId, requestTaskActionType,  appUser, taskActionPayload);

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(peerReviewerTaskAssignmentValidator, times(1))
                .validate(requestTask, requestTaskType, peerReviewer, appUser);
        verify(doeApplyService, times(1)).requestPeerReview(requestTask, peerReviewer, appUser.getUserId());
        verify(requestService, times(1))
            .addActionToRequest(request, null, MrtmRequestActionType.DOE_PEER_REVIEW_REQUESTED, appUser.getUserId());

        verify(workflowService, times(1)).completeTask(requestTask.getProcessTaskId(),
            Map.of(BpmnProcessConstants.REQUEST_ID, requestTask.getRequest().getId(),
                MrtmBpmnProcessConstants.DOE_SUBMIT_OUTCOME, DoeSubmitOutcome.PEER_REVIEW_REQUIRED));
    }

    @Test
    void getTypes() {
        assertThat(peerReviewActionHandler.getTypes()).containsExactly(MrtmRequestTaskActionType.DOE_REQUEST_PEER_REVIEW);
    }
}
