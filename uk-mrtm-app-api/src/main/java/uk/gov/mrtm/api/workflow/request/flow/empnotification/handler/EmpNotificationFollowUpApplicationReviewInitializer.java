package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.time.LocalDate;
import java.util.Set;

@Service
public class EmpNotificationFollowUpApplicationReviewInitializer implements InitializeRequestTaskHandler {

    @Override
    public RequestTaskPayload initializePayload(final Request request) {

        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        final FollowUp followUp = ((EmpNotificationAcceptedDecisionDetails) requestPayload.getReviewDecision().getDetails()).getFollowUp();

        return EmpNotificationFollowUpApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_REVIEW_PAYLOAD)
                .submissionDate(LocalDate.now())
                .followUpRequest(followUp.getFollowUpRequest())
                .followUpResponseExpirationDate(followUp.getFollowUpResponseExpirationDate())
                .followUpResponse(requestPayload.getFollowUpResponse())
                .followUpFiles(requestPayload.getFollowUpResponseFiles())
                .followUpAttachments(requestPayload.getFollowUpResponseAttachments())
                .reviewDecision(requestPayload.getFollowUpReviewDecision())
                .sectionsCompleted(requestPayload.getFollowUpReviewSectionsCompleted())
                .build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_REVIEW);
    }
}
