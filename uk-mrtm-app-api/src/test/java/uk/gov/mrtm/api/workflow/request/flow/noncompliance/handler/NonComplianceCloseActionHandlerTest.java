package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceOutcome;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.service.NonComplianceApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonComplianceCloseActionHandlerTest {

    @InjectMocks
    private NonComplianceCloseActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private NonComplianceApplyService applyService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {

        final long requestTaskId = 1L;
        final String processTaskId = "processTaskId";
        NonComplianceCivilPenaltyRequestTaskPayload expectedTaskPayload = NonComplianceCivilPenaltyRequestTaskPayload.builder().build();
        final RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .payload(NonComplianceCivilPenaltyRequestTaskPayload.builder().build())
            .processTaskId(processTaskId)
            .build();
        final NonComplianceCloseApplicationRequestTaskActionPayload taskActionPayload =
            NonComplianceCloseApplicationRequestTaskActionPayload.builder().build();
        final AppUser appUser = AppUser.builder().build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        RequestTaskPayload actualTaskPayload = handler.process(
            requestTaskId, MrtmRequestTaskActionType.NON_COMPLIANCE_CLOSE_APPLICATION, appUser, taskActionPayload);

        assertEquals(expectedTaskPayload, actualTaskPayload);

        verify(applyService, times(1)).applyCloseAction(requestTask, taskActionPayload);
        verify(workflowService, times(1)).completeTask(
            processTaskId, Map.of(MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.CLOSED)
        );
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.NON_COMPLIANCE_CLOSE_APPLICATION);
    }
}
