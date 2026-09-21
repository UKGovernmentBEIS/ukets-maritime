package uk.gov.mrtm.api.workflow.request.flow.rde.handler;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.rde.domain.RdeSaveRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.rde.domain.RdePayload;

@ExtendWith(MockitoExtension.class)
class RdeSaveActionHandlerTest {

    @InjectMocks
    private RdeSaveActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {
        final Long requestTaskId = 1L;
        final LocalDate dueDate = LocalDate.of(2024, 2, 1);
        final RdePayload rdePayload = RdePayload.builder()
                .extensionDate(LocalDate.of(2024, 3, 1))
                .deadline(LocalDate.of(2024, 2, 15))
                .operators(Set.of("op1"))
                .signatory("signatory")
                .build();
        final EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder().build();
        final RequestTask requestTask = RequestTask.builder()
                .id(requestTaskId)
                .dueDate(dueDate)
                .request(Request.builder().payload(requestPayload).build())
                .build();
        final RdeSaveRequestTaskActionPayload actionPayload = RdeSaveRequestTaskActionPayload.builder()
                .rdePayload(rdePayload)
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        handler.process(requestTaskId, MrtmRequestTaskActionType.RDE_SAVE, AppUser.builder().build(), actionPayload);

        assertThat(requestPayload.getRdeData().getRdePayload()).isEqualTo(rdePayload);
        assertThat(requestPayload.getRdeData().getCurrentDueDate()).isEqualTo(dueDate);
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).isEqualTo(List.of(MrtmRequestTaskActionType.RDE_SAVE));
    }
}
