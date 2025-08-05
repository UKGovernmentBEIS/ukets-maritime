package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper.EmpNotificationMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
public class EmpNotificationFollowUpApplicationAmendsSubmitInitializer implements InitializeRequestTaskHandler {

    private static final EmpNotificationMapper EMP_NOTIFICATION_MAPPER = Mappers.getMapper(EmpNotificationMapper.class);

    @Override
    public RequestTaskPayload initializePayload(final Request request) {

        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        final EmpNotificationFollowUpReviewDecision reviewDecision =
            EMP_NOTIFICATION_MAPPER.cloneFollowUpReviewDecisionIgnoreNotes(requestPayload.getFollowUpReviewDecision());

        EmpNotificationAcceptedDecisionDetails empNotificationAcceptedDecisionDetails =
            (EmpNotificationAcceptedDecisionDetails) requestPayload.getReviewDecision().getDetails();

        return EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_AMENDS_SUBMIT_PAYLOAD)
            .followUpRequest(empNotificationAcceptedDecisionDetails.getFollowUp().getFollowUpRequest())
            .followUpResponseExpirationDate(empNotificationAcceptedDecisionDetails.getFollowUp().getFollowUpResponseExpirationDate())
            .followUpResponse(requestPayload.getFollowUpResponse())
            .followUpFiles(requestPayload.getFollowUpResponseFiles())
            .followUpAttachments(requestPayload.getFollowUpResponseAttachments())
            .submissionDate(requestPayload.getFollowUpResponseSubmissionDate())
            .reviewDecision(reviewDecision)
            .build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_AMENDS_SUBMIT);
    }
}
