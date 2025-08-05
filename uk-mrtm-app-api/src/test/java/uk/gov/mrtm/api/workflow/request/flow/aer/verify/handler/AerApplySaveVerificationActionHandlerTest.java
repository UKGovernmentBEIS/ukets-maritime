package uk.gov.mrtm.api.workflow.request.flow.aer.verify.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerSaveApplicationVerificationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.service.RequestAerApplyVerificationService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerApplySaveVerificationActionHandlerTest {

    @InjectMocks
    private AerApplySaveVerificationActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestAerApplyVerificationService aerApplyVerificationService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        AppUser user = AppUser.builder().build();
        AerSaveApplicationVerificationRequestTaskActionPayload taskActionPayload =
                AerSaveApplicationVerificationRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.AER_SAVE_APPLICATION_VERIFICATION_PAYLOAD)
                        .build();
        RequestTask requestTask = RequestTask.builder().id(requestTaskId).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        handler.process(requestTaskId, MrtmRequestTaskActionType.AER_SAVE_APPLICATION_VERIFICATION, user, taskActionPayload);

        // Verify
        verify(requestTaskService, times(1))
                .findTaskById(requestTaskId);
        verify(aerApplyVerificationService, times(1))
                .applySaveAction(taskActionPayload, requestTask);
        verifyNoMoreInteractions(requestTaskService, aerApplyVerificationService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsOnly(MrtmRequestTaskActionType.AER_SAVE_APPLICATION_VERIFICATION);
    }
}
