package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestExpirationType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpWaitForAmendsRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationWaitForFollowUpRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestTaskTimeManagementService;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExtendFollowUpExpirationTimerServiceTest {

    @InjectMocks
    private ExtendFollowUpExpirationTimerService service;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestTaskTimeManagementService requestTaskTimeManagementService;

    @Test
    void extendTimer_duringWaitForFollowUp() {

        final String requestId = "1";
        final String assignee = "regulator";
        final LocalDate previousDueDate = LocalDate.of(2023, 1, 1);
        final EmpNotificationRequestPayload payload = EmpNotificationRequestPayload.builder()
            .reviewDecision(EmpNotificationReviewDecision.builder()
                .details(
                    EmpNotificationAcceptedDecisionDetails.builder()
                        .officialNotice("officialNotice")
                        .followUp(FollowUp.builder()
                            .followUpRequest("the request")
                            .followUpResponseExpirationDate(previousDueDate)
                            .build())
                        .build()
                )
                .build())
            .regulatorAssignee(assignee)
            .build();
        final Request request = Request.builder()
            .id(requestId)
            .type(RequestType.builder().code(MrtmRequestType.EMP_NOTIFICATION).build())
            .payload(payload)
            .build();
        final RequestTask followUpTask = RequestTask.builder()
            .payload(EmpNotificationFollowUpRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_PAYLOAD)
                .followUpResponseExpirationDate(previousDueDate)
                .build())
            .build();
        final RequestTask waitTask = RequestTask.builder()
            .payload(EmpNotificationWaitForFollowUpRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_WAIT_FOR_FOLLOW_UP_PAYLOAD)
                .followUpResponseExpirationDate(previousDueDate)
                .build())
            .build();

        final Date expirationDate = new GregorianCalendar(2023, Calendar.FEBRUARY, 1).getTime();
        final LocalDate dueDate = LocalDate.of(2023, 2, 1);

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestTaskTimeManagementService.setDueDateToTasks("1",
            MrtmRequestExpirationType.FOLLOW_UP_RESPONSE,
            dueDate)).thenReturn(List.of(followUpTask, waitTask));

        // Invoke
        service.extendTimer(requestId, expirationDate);

        // Verify
        assertThat(
            ((EmpNotificationAcceptedDecisionDetails) payload.getReviewDecision().getDetails()).getFollowUp().getFollowUpResponseExpirationDate()).isEqualTo(
            dueDate);
        assertThat(((EmpNotificationFollowUpRequestTaskPayload) followUpTask.getPayload()).getFollowUpResponseExpirationDate()).isEqualTo(dueDate);
        assertThat(((EmpNotificationWaitForFollowUpRequestTaskPayload) waitTask.getPayload()).getFollowUpResponseExpirationDate()).isEqualTo(dueDate);

        verify(requestService, times(1)).addActionToRequest(
            request,
            null,
            MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_DATE_EXTENDED,
            "regulator");
    }

    @Test
    void extendTimer_duringWaitForAmend() {

        final String requestId = "1";
        final String assignee = "regulator";
        final LocalDate previousDueDate = LocalDate.of(2023, 1, 1);
        final EmpNotificationRequestPayload payload = EmpNotificationRequestPayload.builder()
            .followUpReviewDecision(EmpNotificationFollowUpReviewDecision.builder()
                .details(EmpNotificationFollowupRequiredChangesDecisionDetails.builder().dueDate(previousDueDate).build()).build())
            .regulatorAssignee(assignee)
            .build();
        final Request request = Request.builder()
            .id(requestId)
            .type(RequestType.builder().code(MrtmRequestType.EMP_NOTIFICATION).build())
            .payload(payload)
            .build();
        final RequestTask followUpTask = RequestTask.builder()
            .payload(EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_AMENDS_SUBMIT_PAYLOAD)
                .reviewDecision(EmpNotificationFollowUpReviewDecision.builder()
                    .details(EmpNotificationFollowupRequiredChangesDecisionDetails.builder().dueDate(previousDueDate).build()).build())
                .build())
            .build();
        final RequestTask waitTask = RequestTask.builder()
            .payload(EmpNotificationFollowUpWaitForAmendsRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_WAIT_FOR_AMENDS_PAYLOAD)
                .reviewDecision(EmpNotificationFollowUpReviewDecision.builder()
                    .details(EmpNotificationFollowupRequiredChangesDecisionDetails.builder().dueDate(previousDueDate).build()).build())
                .build())
            .build();

        final Date expirationDate = new GregorianCalendar(2023, Calendar.FEBRUARY, 1).getTime();
        final LocalDate dueDate = LocalDate.of(2023, 2, 1);

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestTaskTimeManagementService.setDueDateToTasks("1",
            MrtmRequestExpirationType.FOLLOW_UP_RESPONSE,
            dueDate)).thenReturn(List.of(followUpTask, waitTask));

        // Invoke
        service.extendTimer(requestId, expirationDate);

        // Verify
        assertThat(((EmpNotificationFollowupRequiredChangesDecisionDetails) payload.getFollowUpReviewDecision().getDetails()).getDueDate()).isEqualTo(
            dueDate);
        assertThat(
            ((EmpNotificationFollowupRequiredChangesDecisionDetails) ((EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload) followUpTask.getPayload()).getReviewDecision()
                .getDetails()).getDueDate()).isEqualTo(
            dueDate);
        assertThat(
            ((EmpNotificationFollowupRequiredChangesDecisionDetails) ((EmpNotificationFollowUpWaitForAmendsRequestTaskPayload) waitTask.getPayload()).getReviewDecision()
                .getDetails()).getDueDate()).isEqualTo(dueDate);

        verify(requestService, times(1)).addActionToRequest(
            request,
            null,
            MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_DATE_EXTENDED,
            "regulator");
    }
}
