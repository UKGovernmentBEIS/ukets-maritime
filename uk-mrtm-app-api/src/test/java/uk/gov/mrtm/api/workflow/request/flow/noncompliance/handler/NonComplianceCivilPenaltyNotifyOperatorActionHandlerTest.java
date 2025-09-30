package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceDecisionNotification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNotifyOperatorRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceOutcome;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.service.NonComplianceApplyService;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.service.NonComplianceSendOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.validation.NonComplianceApplicationValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonComplianceCivilPenaltyNotifyOperatorActionHandlerTest {

    @InjectMocks
    private NonComplianceCivilPenaltyNotifyOperatorActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private NonComplianceApplicationValidator validator;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestActionUserInfoResolver requestActionUserInfoResolver;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private NonComplianceSendOfficialNoticeService officialNoticeService;

    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;

    @Mock
    private NonComplianceApplyService nonComplianceApplyService;

    @Test
    void process() {

        final long requestTaskId = 1L;
        final Request request = Request.builder().build();
        final UUID civilPenalty = UUID.randomUUID();
        final NonComplianceCivilPenaltyRequestTaskPayload taskPayload =
            NonComplianceCivilPenaltyRequestTaskPayload.builder().civilPenalty(civilPenalty).build();
        final NonComplianceCivilPenaltyRequestTaskPayload expectedTaskPayload =
            NonComplianceCivilPenaltyRequestTaskPayload.builder().civilPenalty(civilPenalty).build();
        final RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .payload(taskPayload)
            .processTaskId("processTaskId")
            .request(request)
            .build();
        final Set<String> operators = Set.of("operator");
        final NonComplianceDecisionNotification decisionNotification =
            NonComplianceDecisionNotification.builder().operators(operators).build();
        final NonComplianceNotifyOperatorRequestTaskActionPayload taskActionPayload =
            NonComplianceNotifyOperatorRequestTaskActionPayload.builder()
                .decisionNotification(decisionNotification)
                .build();
        final AppUser appUser = AppUser.builder().userId("userId").build();
        final Map<String, RequestActionUserInfo> userInfo =
            Map.of("operator", RequestActionUserInfo.builder().name("operator name").build());
        final NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload actionPayload =
            NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.NON_COMPLIANCE_CIVIL_PENALTY_APPLICATION_SUBMITTED_PAYLOAD)
                .civilPenalty(civilPenalty)
                .decisionNotification(decisionNotification)
                .usersInfo(userInfo)
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request)).thenReturn(Optional.of(
            UserInfoDTO.builder().firstName("operator").build()));
        when(requestActionUserInfoResolver.getUsersInfo(operators, request)).thenReturn(userInfo);

        RequestTaskPayload actualTaskPayload = handler.process(requestTaskId,
            MrtmRequestTaskActionType.NON_COMPLIANCE_CIVIL_PENALTY_NOTIFY_OPERATOR,
            appUser,
            taskActionPayload
        );

        assertEquals(expectedTaskPayload, actualTaskPayload);

        verify(validator, times(1)).validateCivilPenalty(taskPayload);
        verify(validator, times(1)).validateUsers(requestTask, operators, Set.of(), appUser);
        verify(nonComplianceApplyService, times(1)).submitDetails(request, taskPayload);
        verify(requestService, times(1)).addActionToRequest(
            request,
            actionPayload,
            MrtmRequestActionType.NON_COMPLIANCE_CIVIL_PENALTY_APPLICATION_SUBMITTED,
            "userId"
        );
        verify(workflowService, times(1)).completeTask("processTaskId", Map.of(
            MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.SUBMITTED
        ));
        verify(officialNoticeService, times(1)).sendOfficialNotice(
            civilPenalty, request, decisionNotification
        );

        verifyNoMoreInteractions(validator, nonComplianceApplyService, requestService,
            workflowService, officialNoticeService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes())
            .containsExactly(MrtmRequestTaskActionType.NON_COMPLIANCE_CIVIL_PENALTY_NOTIFY_OPERATOR);
    }
}
