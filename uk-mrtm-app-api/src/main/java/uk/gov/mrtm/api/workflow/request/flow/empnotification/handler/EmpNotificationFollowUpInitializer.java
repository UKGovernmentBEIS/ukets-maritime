package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.time.LocalDate;
import java.util.Set;

@Service
public class EmpNotificationFollowUpInitializer implements InitializeRequestTaskHandler {

    @Override
    public RequestTaskPayload initializePayload(final Request request) {
        EmpNotificationRequestPayload payload = (EmpNotificationRequestPayload) request.getPayload();
        final FollowUp followUp = ((EmpNotificationAcceptedDecisionDetails) payload.getReviewDecision().getDetails()).getFollowUp();
        final String followUpRequest = followUp.getFollowUpRequest();
        final LocalDate followUpResponseExpirationDate = followUp.getFollowUpResponseExpirationDate();

        return EmpNotificationFollowUpRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_PAYLOAD)
                .followUpRequest(followUpRequest)
                .followUpResponseExpirationDate(followUpResponseExpirationDate)
                .build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP);
    }
}
