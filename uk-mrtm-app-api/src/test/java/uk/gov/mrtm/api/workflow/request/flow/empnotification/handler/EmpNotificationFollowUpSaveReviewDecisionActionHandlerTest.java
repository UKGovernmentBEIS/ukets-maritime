package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpSaveReviewDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpSaveReviewDecisionActionHandlerTest {

    @InjectMocks
    private EmpNotificationFollowUpSaveReviewDecisionActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @ParameterizedTest
    @MethodSource("successScenarios")
    void process_amends_valid(EmpNotificationFollowUpReviewDecisionType type) {

        final LocalDate dueDate = LocalDate.of(2023, 12, 1);
        final LocalDate followUpExpirationDate = LocalDate.of(2023, 1, 1);
        final EmpNotificationFollowUpReviewDecision decision = EmpNotificationFollowUpReviewDecision.builder()
            .type(type)
            .details(EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                .dueDate(dueDate)
                .build())
            .build();
        final EmpNotificationFollowUpSaveReviewDecisionRequestTaskActionPayload actionPayload =
            EmpNotificationFollowUpSaveReviewDecisionRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_FOLLOW_UP_SAVE_REVIEW_DECISION_PAYLOAD)
                .reviewDecision(decision)
                .sectionsCompleted(Map.of("section", "accepted"))
                .build();
        final AppUser appUser = AppUser.builder().build();
        final String processTaskId = "processTaskId";
        EmpNotificationFollowUpApplicationReviewRequestTaskPayload expectedRequestTaskPayload =
            EmpNotificationFollowUpApplicationReviewRequestTaskPayload.builder()
            .followUpResponseExpirationDate(followUpExpirationDate)
            .build();
        final RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .processTaskId(processTaskId)
            .payload(expectedRequestTaskPayload)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SAVE_REVIEW_DECISION,
            appUser,
            actionPayload);

        // Verify
        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verify(requestTaskService, times(1)).findTaskById(requestTask.getId());

        assertThat(
            ((EmpNotificationFollowUpApplicationReviewRequestTaskPayload) requestTask.getPayload()).getReviewDecision()).isEqualTo(
            decision);
        assertThat(
            ((EmpNotificationFollowUpApplicationReviewRequestTaskPayload) requestTask.getPayload()).getSectionsCompleted()).isEqualTo(
            Map.of("section", "accepted"));
    }

    @Test
    void process_amends_invalid_due_date_is_after() {

        final LocalDate dueDate = LocalDate.of(2023, 1, 1);
        final LocalDate followUpExpirationDate = LocalDate.of(2023, 12, 1);
        final EmpNotificationFollowUpReviewDecision decision = EmpNotificationFollowUpReviewDecision.builder()
                .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
                .details(EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                        .dueDate(dueDate)
                                .build())
                .build();
        final EmpNotificationFollowUpSaveReviewDecisionRequestTaskActionPayload actionPayload =
                EmpNotificationFollowUpSaveReviewDecisionRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_FOLLOW_UP_SAVE_REVIEW_DECISION_PAYLOAD)
                        .reviewDecision(decision)
                        .sectionsCompleted(Map.of("section", "accepted"))
                        .build();
        final AppUser appUser = AppUser.builder().build();
        final String processTaskId = "processTaskId";
        final RequestTask requestTask = RequestTask.builder()
                .id(1L)
                .processTaskId(processTaskId)
                .payload(EmpNotificationFollowUpApplicationReviewRequestTaskPayload.builder()
                        .followUpResponseExpirationDate(followUpExpirationDate)
                        .build())
                .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        BusinessException be = assertThrows(BusinessException.class,
            () -> handler.process(requestTask.getId(),
                MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SAVE_REVIEW_DECISION,
                appUser,
                actionPayload));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.FORM_VALIDATION);

        // Verify
        assertThat(
                ((EmpNotificationFollowUpApplicationReviewRequestTaskPayload) requestTask.getPayload()).getReviewDecision()).isNull();
    }

    private static Stream successScenarios() {
        return Stream.of(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED,
            EmpNotificationFollowUpReviewDecisionType.ACCEPTED
        );
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SAVE_REVIEW_DECISION);
    }
}

