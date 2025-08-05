package uk.gov.mrtm.api.workflow.request.flow.aer.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.reporting.domain.AerSave;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.service.RequestAerApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerApplySaveActionHandlerTest {
    @InjectMocks
    private AerApplySaveActionHandler applySaveActionHandler;

    @Mock
    private RequestAerApplyService requestAerApplyService;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        AppUser pmrvUser = AppUser.builder().build();
        AerSaveApplicationRequestTaskActionPayload taskActionPayload =
            AerSaveApplicationRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.AER_SAVE_APPLICATION_PAYLOAD)
                .aer(AerSave.builder()
                        .additionalDocuments(AdditionalDocuments.builder()
                                .exist(false)
                                .build()
                        )
                        .build())
                .build();
        AerApplicationSubmitRequestTaskPayload expectedTaskPayload = mock(AerApplicationSubmitRequestTaskPayload.class);
        RequestTask requestTask = RequestTask.builder().payload(expectedTaskPayload).id(requestTaskId).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        RequestTaskPayload actualTaskPayload = applySaveActionHandler.process(requestTask.getId(), MrtmRequestTaskActionType.AER_SAVE_APPLICATION,
            pmrvUser, taskActionPayload);

        // Verify
        assertThat(actualTaskPayload).isEqualTo(expectedTaskPayload);
        verify(requestAerApplyService, times(1)).applySaveAction(taskActionPayload, requestTask);
    }

    @Test
    void getTypes() {
        assertThat(applySaveActionHandler.getTypes()).containsOnly(MrtmRequestTaskActionType.AER_SAVE_APPLICATION);
    }
}