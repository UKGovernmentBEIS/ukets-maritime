package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.DateOfNonSignificantChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotification;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationDetailsOfChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpNotificationWaitForPeerReviewInitializerTest {

    @InjectMocks
    private EmpNotificationWaitForPeerReviewInitializer initializer;

    @Test
    void initializePayload() {
        UUID fileUuid = UUID.randomUUID();
        String filename = "document";
        final EmissionsMonitoringPlanNotification empNotification = EmissionsMonitoringPlanNotification.builder()
            .detailsOfChange(EmpNotificationDetailsOfChange.builder()
                .description("description")
                .justification("justification")
                .dateOfNonSignificantChange(
                    DateOfNonSignificantChange
                        .builder()
                        .startDate(LocalDate.now())
                        .endDate(LocalDate.now().plusDays(1))
                        .build()
                )
                .documents(Set.of(fileUuid))
                .build())
            .build();
        final EmpNotificationReviewDecision decision = EmpNotificationReviewDecision.builder()
            .type(EmpNotificationReviewDecisionType.ACCEPTED)
            .details(
                EmpNotificationAcceptedDecisionDetails.builder()
                    .notes("notes")
                    .officialNotice("officialNotice")
                    .followUp(FollowUp.builder()
                        .followUpRequest("the request")
                        .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                        .build())
                    .build()
            )
            .build();
        final Request request = Request.builder()
            .id("1")
            .type(RequestType.builder().code(MrtmRequestType.EMP_NOTIFICATION).build())
            .status(RequestStatuses.IN_PROGRESS)
            .payload(EmpNotificationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_NOTIFICATION_REQUEST_PAYLOAD)
                .emissionsMonitoringPlanNotification(empNotification)
                .empNotificationAttachments(Map.of(fileUuid, filename))
                .reviewDecision(decision)
                .build())
            .build();

        final RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);
        assertThat(requestTaskPayload.getPayloadType()).isEqualTo(
            MrtmRequestTaskPayloadType.EMP_NOTIFICATION_WAIT_FOR_PEER_REVIEW_PAYLOAD);
        assertThat(requestTaskPayload).isInstanceOf(EmpNotificationApplicationReviewRequestTaskPayload.class);
        assertThat(((EmpNotificationApplicationReviewRequestTaskPayload) requestTaskPayload)
            .getEmissionsMonitoringPlanNotification()).isEqualTo(empNotification);
        assertThat(((EmpNotificationApplicationReviewRequestTaskPayload) requestTaskPayload).getEmpNotificationAttachments())
            .isEqualTo(Map.of(fileUuid, filename));
        assertThat(((EmpNotificationApplicationReviewRequestTaskPayload) requestTaskPayload).getReviewDecision())
            .isEqualTo(decision);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsExactly(
            MrtmRequestTaskType.EMP_NOTIFICATION_WAIT_FOR_PEER_REVIEW);
    }
}
