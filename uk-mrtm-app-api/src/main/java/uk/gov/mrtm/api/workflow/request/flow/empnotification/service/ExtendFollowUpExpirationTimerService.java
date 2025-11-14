package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestExpirationType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpWaitForAmendsRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationWaitForFollowUpRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestTaskTimeManagementService;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExtendFollowUpExpirationTimerService {

    private final RequestService requestService;
    private final RequestTaskTimeManagementService requestTaskTimeManagementService;

    public void extendTimer(final String requestId, final Date expirationDate) {

        final Request request = requestService.findRequestById(requestId);
        final LocalDate dueDate = expirationDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        final List<RequestTask> requestTasks =
            requestTaskTimeManagementService.setDueDateToTasks(requestId, MrtmRequestExpirationType.FOLLOW_UP_RESPONSE, dueDate);
        this.updateTaskPayloads(dueDate, requestTasks);
        this.updateRequestPayload(request, dueDate);

        requestService.addActionToRequest(request,
            null,
                MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_DATE_EXTENDED,
            request.getPayload().getRegulatorAssignee());
    }

    private void updateRequestPayload(final Request request, final LocalDate dueDate) {
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        if (requestPayload.getFollowUpReviewDecision() != null) {
            ((EmpNotificationFollowupRequiredChangesDecisionDetails) requestPayload.getFollowUpReviewDecision().getDetails()).setDueDate(dueDate);
        } else {
            ((EmpNotificationAcceptedDecisionDetails) requestPayload.getReviewDecision().getDetails()).getFollowUp()
                .setFollowUpResponseExpirationDate(dueDate);
        }
    }

    private void updateTaskPayloads(final LocalDate dueDate, final List<RequestTask> requestTasks) {
        requestTasks.stream().map(RequestTask::getPayload)
            .filter(p -> p.getPayloadType().equals(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_WAIT_FOR_FOLLOW_UP_PAYLOAD))
            .forEach(p -> ((EmpNotificationWaitForFollowUpRequestTaskPayload) p).setFollowUpResponseExpirationDate(dueDate));

        requestTasks.stream().map(RequestTask::getPayload)
            .filter(p -> p.getPayloadType().equals(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_PAYLOAD))
            .forEach(p -> ((EmpNotificationFollowUpRequestTaskPayload) p).setFollowUpResponseExpirationDate(dueDate));

        requestTasks.stream().map(RequestTask::getPayload)
            .filter(p -> p.getPayloadType().equals(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_WAIT_FOR_AMENDS_PAYLOAD))
            .forEach(p -> {
                EmpNotificationFollowUpReviewDecision reviewDecision = ((EmpNotificationFollowUpWaitForAmendsRequestTaskPayload) p).getReviewDecision();
                ((EmpNotificationFollowupRequiredChangesDecisionDetails) reviewDecision.getDetails()).setDueDate(dueDate);
                ((EmpNotificationFollowUpWaitForAmendsRequestTaskPayload) p).setFollowUpResponseExpirationDate(dueDate);
            });

        requestTasks.stream().map(RequestTask::getPayload)
            .filter(p -> p.getPayloadType().equals(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_AMENDS_SUBMIT_PAYLOAD))
            .forEach(p -> {
                EmpNotificationFollowUpReviewDecision reviewDecision = ((EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload) p).getReviewDecision();
                ((EmpNotificationFollowupRequiredChangesDecisionDetails) reviewDecision.getDetails()).setDueDate(dueDate);
            });
    }
}
