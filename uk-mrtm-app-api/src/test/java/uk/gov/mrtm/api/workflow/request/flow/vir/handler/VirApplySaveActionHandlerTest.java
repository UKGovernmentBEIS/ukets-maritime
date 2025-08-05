package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.OperatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VirApplySaveActionHandlerTest {

    @InjectMocks
    private VirApplySaveActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private VirApplyService applyService;

    @Test
    void doProcess() {

        final VirSaveApplicationRequestTaskActionPayload virApplySavePayload =
            VirSaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.VIR_SAVE_APPLICATION_PAYLOAD)
                        .operatorImprovementResponses(Map.of("A1",
                                OperatorImprovementResponse.builder().isAddressed(false).addressedDescription("description").build()
                        ))
                        .build();

        final RequestTask requestTask = RequestTask.builder().id(1L).build();
        final AppUser appUser = AppUser.builder().build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        handler.process(requestTask.getId(), MrtmRequestTaskActionType.VIR_SAVE_APPLICATION, appUser, virApplySavePayload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(1L);
        verify(applyService, times(1)).applySaveAction(virApplySavePayload, requestTask);
    }

    @Test
    void getTypes() {
        List<String> actual = handler.getTypes();

        assertThat(actual).isEqualTo(List.of(MrtmRequestTaskActionType.VIR_SAVE_APPLICATION));
    }
}
