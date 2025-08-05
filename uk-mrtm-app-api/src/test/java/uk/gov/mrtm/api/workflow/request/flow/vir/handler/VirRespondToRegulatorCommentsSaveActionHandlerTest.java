package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirSaveRespondToRegulatorCommentsRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirRespondToRegulatorCommentsService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VirRespondToRegulatorCommentsSaveActionHandlerTest {

    @InjectMocks
    private VirRespondToRegulatorCommentsSaveActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private VirRespondToRegulatorCommentsService virRespondToRegulatorCommentsService;

    @Test
    void process() {
        
        final long taskId = 1L;
        final RequestTask requestTask = RequestTask.builder().id(taskId).build();
        final AppUser appUser = AppUser.builder().build();
        final VirSaveRespondToRegulatorCommentsRequestTaskActionPayload actionPayload =
            VirSaveRespondToRegulatorCommentsRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.VIR_SAVE_RESPOND_TO_REGULATOR_COMMENTS_PAYLOAD)
                        .build();

        when(requestTaskService.findTaskById(taskId)).thenReturn(requestTask);

        // Invoke
        handler.process(taskId, MrtmRequestTaskActionType.VIR_SAVE_RESPOND_TO_REGULATOR_COMMENTS, appUser, actionPayload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(1L);
        verify(virRespondToRegulatorCommentsService, times(1)).applySaveAction(actionPayload, requestTask);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).isEqualTo(List.of(MrtmRequestTaskActionType.VIR_SAVE_RESPOND_TO_REGULATOR_COMMENTS));
    }
}
