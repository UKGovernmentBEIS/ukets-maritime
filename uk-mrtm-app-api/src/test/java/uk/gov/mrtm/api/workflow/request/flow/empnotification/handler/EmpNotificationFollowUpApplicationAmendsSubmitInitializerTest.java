package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotification;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpApplicationAmendsSubmitInitializerTest {

    @InjectMocks
    private EmpNotificationFollowUpApplicationAmendsSubmitInitializer initializer;

    @Test
    void initializePayload() {

        final EmpNotificationFollowUpReviewDecision reviewDecision =
            EmpNotificationFollowUpReviewDecision.builder()
                .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
                .details(
                    EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                        .notes("the notes")
                        .dueDate(LocalDate.of(2023, 1, 1))
                        .requiredChanges(Collections.singletonList(new ReviewDecisionRequiredChange("the changes required", Collections.emptySet())))
                        .build()
                )
                .build();

        final UUID file = UUID.randomUUID();
        final Request request = Request.builder()
            .type(RequestType.builder().code(MrtmRequestType.EMP_NOTIFICATION).build())
            .payload(EmpNotificationRequestPayload.builder()
                .reviewDecision(EmpNotificationReviewDecision.builder()
                    .type(EmpNotificationReviewDecisionType.ACCEPTED)
                    .details(
                        EmpNotificationAcceptedDecisionDetails.builder()
                            .officialNotice("officialNotice")
                            .notes("notes")
                            .followUp(FollowUp.builder()
                                .followUpRequest("the request")
                                .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                                .build())
                            .build()
                    )
                    .build())
                .followUpResponse("the response")
                .followUpReviewDecision(reviewDecision)
                .followUpResponseFiles(Set.of(file))
                .followUpResponseAttachments(Map.of(file, "filename"))
                .emissionsMonitoringPlanNotification(EmissionsMonitoringPlanNotification.builder().build())
                .followUpResponseSubmissionDate(LocalDate.of(2022, 1, 1))
                .followUpReviewSectionsCompleted(Map.of("section", "accepted"))
                .build())
            .build();

        final EmpNotificationFollowUpReviewDecision expectedReviewDecision =
            EmpNotificationFollowUpReviewDecision.builder()
                .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
                .details(
                    EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                        .notes(null)
                        .dueDate(LocalDate.of(2023, 1, 1))
                        .requiredChanges(Collections.singletonList(
                            new ReviewDecisionRequiredChange("the changes required", Collections.emptySet())))
                        .build()
                )
                .build();
        final EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload expected =
            EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_AMENDS_SUBMIT_PAYLOAD)
                .followUpRequest("the request")
                .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                .followUpResponse("the response")
                .followUpFiles(Set.of(file))
                .followUpAttachments(Map.of(file, "filename"))
                .submissionDate(LocalDate.of(2022, 1, 1))
                .reviewDecision(expectedReviewDecision)
                .build();

        final RequestTaskPayload actual = initializer.initializePayload(request);

        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).isEqualTo(
            Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_AMENDS_SUBMIT));
    }
}
