package uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.service.RequestEmpService;
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
class EmpIssuanceApplyImportThirdPartyDataActionHandlerTest {

    @InjectMocks
    private EmpIssuanceApplyImportThirdPartyDataActionHandler handler;

    @Mock
    private RequestEmpService requestEmpService;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        EmpIssuanceSaveApplicationRequestTaskActionPayload requestTaskActionPayload =
            EmpIssuanceSaveApplicationRequestTaskActionPayload.builder()
                .build();

        RequestTask requestTask = RequestTask.builder().id(requestTaskId).payload(expectedRequestTaskPayload).build();
        AppUser appUser = AppUser.builder().build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        //invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_ISSUANCE_SAVE_APPLICATION, appUser, requestTaskActionPayload);

        // Verify
        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(requestTaskService).findTaskById(requestTaskId);
        verify(requestEmpService).updateStagingEmp(requestTask);
        verify(requestEmpService).applySaveAction(requestTaskActionPayload, requestTask);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsOnly(MrtmRequestTaskActionType.EMP_ISSUANCE_IMPORT_THIRD_PARTY_DATA_APPLICATION);
    }
}
