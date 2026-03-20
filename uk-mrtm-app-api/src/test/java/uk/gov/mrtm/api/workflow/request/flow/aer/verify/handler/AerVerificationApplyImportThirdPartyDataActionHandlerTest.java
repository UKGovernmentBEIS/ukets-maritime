package uk.gov.mrtm.api.workflow.request.flow.aer.verify.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerVerificationImportThirdPartyDataRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.service.RequestAerApplyVerificationService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerVerificationApplyImportThirdPartyDataActionHandlerTest {

    @InjectMocks
    private AerVerificationApplyImportThirdPartyDataActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;
    @Mock
    private RequestAerApplyVerificationService requestAerApplyVerificationService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String requestTaskActionType = "requestTaskActionType";
        AppUser appUser = AppUser.builder().build();
        AerVerificationImportThirdPartyDataRequestTaskActionPayload payload =
            mock(AerVerificationImportThirdPartyDataRequestTaskActionPayload.class);
        RequestTask requestTask = mock(RequestTask.class);
        AerApplicationVerificationSubmitRequestTaskPayload taskPayload =
            mock(AerApplicationVerificationSubmitRequestTaskPayload.class);

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);
        when(requestTask.getPayload()).thenReturn(taskPayload);

        // Invoke
        RequestTaskPayload actualTaskPayload = handler.process(requestTaskId,
            requestTaskActionType, appUser, payload);

        // Verify
        assertThat(actualTaskPayload).isEqualTo(taskPayload);
        verify(requestTaskService).findTaskById(requestTaskId);
        verify(requestAerApplyVerificationService).applyStagingData(requestTask, payload);
        verifyNoMoreInteractions(requestTaskService, requestAerApplyVerificationService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsOnly(MrtmRequestTaskActionType.AER_VERIFICATION_IMPORT_THIRD_PARTY_DATA_APPLICATION);
    }
}