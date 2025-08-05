package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirSaveReviewRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirReviewService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VirReviewSaveActionHandlerTest {

    @InjectMocks
    private VirReviewSaveActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private VirReviewService virReviewService;

    @Test
    void process() {
        
        final long requestTaskId = 1L;
        final AppUser appUser = AppUser.builder().build();
        final VirSaveReviewRequestTaskActionPayload actionPayload =
            VirSaveReviewRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.VIR_SAVE_REVIEW_PAYLOAD)
                .build();
        RequestTask requestTask = RequestTask.builder().id(requestTaskId).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        handler.process(requestTaskId, MrtmRequestTaskActionType.VIR_SAVE_REVIEW, appUser, actionPayload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(virReviewService, times(1)).saveReview(actionPayload, requestTask);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.VIR_SAVE_REVIEW);
    }
}
