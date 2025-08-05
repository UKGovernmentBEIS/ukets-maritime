package uk.gov.mrtm.api.workflow.request.flow.doe.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.service.RequestDoeApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoeApplySaveActionHandlerTest {

    @InjectMocks
    private DoeApplySaveActionHandler applySaveActionHandler;

    @Mock
    private RequestDoeApplyService requestDoeApplyService;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        RequestTask requestTask = RequestTask.builder().id(requestTaskId).build();
        AppUser appUser = AppUser.builder().build();
        DoeSaveApplicationRequestTaskActionPayload taskActionPayload =
                DoeSaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.DOE_SAVE_APPLICATION_PAYLOAD)
                        .doe(Doe.builder().build())
                        .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        applySaveActionHandler.process(requestTask.getId(), MrtmRequestTaskActionType.DOE_SAVE_APPLICATION,
                appUser, taskActionPayload);

        // Verify
        verify(requestDoeApplyService, times(1)).applySaveAction(taskActionPayload, requestTask);
    }

    @Test
    void getTypes() {
        assertThat(applySaveActionHandler.getTypes())
                .containsOnly(MrtmRequestTaskActionType.DOE_SAVE_APPLICATION);
    }
}
