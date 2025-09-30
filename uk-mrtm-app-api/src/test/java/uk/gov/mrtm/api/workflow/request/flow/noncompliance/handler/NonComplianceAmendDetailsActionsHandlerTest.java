package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceAmendDetailsRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.service.NonComplianceApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonComplianceAmendDetailsActionsHandlerTest {

    @InjectMocks
    private NonComplianceAmendDetailsActionsHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private NonComplianceApplyService nonComplianceApplyService;

    @Test
    void process() {
        final long requestTaskId = 1L;
        final RequestTask requestTask = RequestTask.builder().id(requestTaskId).build();

        final NonComplianceAmendDetailsRequestTaskActionPayload taskActionPayload =
            NonComplianceAmendDetailsRequestTaskActionPayload.builder().build();
        final AppUser appUser = AppUser.builder().build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        handler.process(requestTaskId,
            MrtmRequestTaskActionType.NON_COMPLIANCE_AMEND_DETAILS,
            appUser,
            taskActionPayload
        );

        verify(nonComplianceApplyService, times(1)).amendDetails(requestTask, taskActionPayload, appUser);
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verifyNoMoreInteractions(requestTaskService, nonComplianceApplyService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.NON_COMPLIANCE_AMEND_DETAILS);
    }
}