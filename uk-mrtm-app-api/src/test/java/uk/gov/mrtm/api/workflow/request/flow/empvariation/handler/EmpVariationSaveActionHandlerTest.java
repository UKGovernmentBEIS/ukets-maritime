package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationSubmitService;
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
class EmpVariationSaveActionHandlerTest {

    @InjectMocks
    private EmpVariationSaveActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private EmpVariationSubmitService service;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String requestTaskActionType = MrtmRequestTaskActionType.EMP_VARIATION_SAVE_APPLICATION;
        AppUser appuser = AppUser.builder().userId("user").build();
        RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        EmpVariationSaveApplicationRequestTaskActionPayload payload =
            EmpVariationSaveApplicationRequestTaskActionPayload
                .builder()
                .emissionsMonitoringPlan(EmissionsMonitoringPlan
                    .builder()
                    .abbreviations(EmpAbbreviations.builder().exist(false).build())
                    .build())
                .build();

        RequestTask requestTask = RequestTask.builder().id(1L).payload(expectedRequestTaskPayload).build();
        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        RequestTaskPayload requestTaskPayload = handler.process(requestTaskId, requestTaskActionType, appuser, payload);

        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(requestTaskService).findTaskById(requestTask.getId());
        verify(service).saveEmpVariation(payload, requestTask);
        verifyNoMoreInteractions(requestTaskService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes())
            .containsExactlyInAnyOrder(MrtmRequestTaskActionType.EMP_VARIATION_SAVE_APPLICATION);
    }
}
