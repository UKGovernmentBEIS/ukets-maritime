package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpWaitForAmendsRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EmpNotificationFollowUpWaitForAmendsInitializer implements InitializeRequestTaskHandler {

    @Override
    public RequestTaskPayload initializePayload(final Request request) {

        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        final Set<UUID> followUpResponseFiles = requestPayload.getFollowUpResponseFiles();
        final Set<UUID> amendFiles = ((EmpNotificationFollowupRequiredChangesDecisionDetails) requestPayload.getFollowUpReviewDecision()
            .getDetails()).getRequiredChanges().stream().map(
            ReviewDecisionRequiredChange::getFiles).flatMap(Collection::stream).collect(Collectors.toSet());
        final Map<UUID, String> followUpResponseAttachments = requestPayload.getFollowUpResponseAttachments()
            .entrySet().stream()
            .filter(e -> amendFiles.contains(e.getKey()) || followUpResponseFiles.contains(e.getKey()))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        LocalDate followUpDueDate = ((EmpNotificationAcceptedDecisionDetails)
            requestPayload.getReviewDecision().getDetails()).getFollowUp().getFollowUpResponseExpirationDate();
        LocalDate amendsDueDate = ((EmpNotificationFollowupRequiredChangesDecisionDetails)
            requestPayload.getFollowUpReviewDecision().getDetails()).getDueDate();

        return EmpNotificationFollowUpWaitForAmendsRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_WAIT_FOR_AMENDS_PAYLOAD)
            .followUpRequest(((EmpNotificationAcceptedDecisionDetails) requestPayload.getReviewDecision().getDetails()).getFollowUp().getFollowUpRequest())
            .followUpResponse(requestPayload.getFollowUpResponse())
            .followUpFiles(followUpResponseFiles)
            .reviewDecision(requestPayload.getFollowUpReviewDecision())
            .followUpResponseAttachments(followUpResponseAttachments)
            .followUpResponseExpirationDate(amendsDueDate != null ? amendsDueDate : followUpDueDate)
            .build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP_WAIT_FOR_AMENDS);
    }
}
