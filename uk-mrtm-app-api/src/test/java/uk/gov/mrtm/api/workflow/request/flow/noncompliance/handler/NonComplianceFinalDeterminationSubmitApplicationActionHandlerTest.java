package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDetermination;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceOutcome;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.validation.NonComplianceApplicationValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.Map;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonComplianceFinalDeterminationSubmitApplicationActionHandlerTest {

    @InjectMocks
    private NonComplianceFinalDeterminationSubmitApplicationActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private NonComplianceApplicationValidator validator;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private RequestService requestService;

    @ParameterizedTest
    @MethodSource("processScenarios")
    void process(boolean reissuePenalty, NonComplianceOutcome outcome) {

        final long requestTaskId = 1L;
        final String processTaskId = "processTaskId";
        final NonComplianceFinalDeterminationRequestTaskPayload taskPayload =
            NonComplianceFinalDeterminationRequestTaskPayload.builder()
                .finalDetermination(NonComplianceFinalDetermination.builder().reissuePenalty(reissuePenalty).build())
                .build();

        final NonComplianceFinalDeterminationRequestTaskPayload expectedTaskPayload =
            NonComplianceFinalDeterminationRequestTaskPayload.builder()
                .finalDetermination(NonComplianceFinalDetermination.builder().reissuePenalty(reissuePenalty).build())
                .build();

        final Request request = Request.builder().id("reqid").payload(NonComplianceRequestPayload.builder().build()).build();
        final RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .request(request)
            .payload(taskPayload)
            .processTaskId(processTaskId)
            .build();
        final RequestTaskActionEmptyPayload taskActionPayload =
            RequestTaskActionEmptyPayload.builder().build();
        final AppUser appUser = AppUser.builder().userId("userId").build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        RequestTaskPayload actualTaskPayload = handler.process(requestTaskId,
            MrtmRequestTaskActionType.NON_COMPLIANCE_SUBMIT_APPLICATION, appUser, taskActionPayload);

        assertEquals(expectedTaskPayload,  actualTaskPayload);

        verify(validator).validateFinalDetermination(taskPayload);
        verify(requestService).addActionToRequest(
            request,
            NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.NON_COMPLIANCE_FINAL_DETERMINATION_APPLICATION_SUBMITTED_PAYLOAD)
                .finalDetermination(NonComplianceFinalDetermination.builder().reissuePenalty(reissuePenalty).build()).build(),
            MrtmRequestActionType.NON_COMPLIANCE_FINAL_DETERMINATION_APPLICATION_SUBMITTED,
            "userId");
        verify(workflowService).completeTask(processTaskId,
            Map.of(MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, outcome));

        verifyNoMoreInteractions(requestTaskService, validator, workflowService, requestService);
    }

    public static Stream<Arguments> processScenarios() {
        return Stream.of(
            Arguments.of(false, NonComplianceOutcome.SUBMITTED),
            Arguments.of(true, NonComplianceOutcome.REISSUE_CIVIL_PENALTY)
        );
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.NON_COMPLIANCE_FINAL_DETERMINATION_SUBMIT_APPLICATION);
    }
}
