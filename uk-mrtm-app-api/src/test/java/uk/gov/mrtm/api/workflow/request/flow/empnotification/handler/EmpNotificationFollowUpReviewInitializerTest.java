package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewRequestTaskPayload;
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
class EmpNotificationFollowUpReviewInitializerTest {

    @InjectMocks
    private EmpNotificationFollowUpApplicationReviewInitializer initializer;

    @Test
    void initializePayload() {

        final EmpNotificationReviewDecision reviewDecision = EmpNotificationReviewDecision.builder()
                .type(EmpNotificationReviewDecisionType.ACCEPTED)
                .details(
                        EmpNotificationAcceptedDecisionDetails.builder()
                                .officialNotice("officialNotice")
                                .followUp(FollowUp.builder()
                                        .followUpRequest("the request")
                                        .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                                        .build())
                                .build()
                )
                .build();

        final EmpNotificationFollowUpReviewDecision followUpReviewDecision = EmpNotificationFollowUpReviewDecision
                .builder()
                .type(EmpNotificationFollowUpReviewDecisionType.ACCEPTED)
                .details(
                        EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                                .requiredChanges(Collections.singletonList(new ReviewDecisionRequiredChange("the changes", Collections.emptySet())))
                                .build()
                )
                .build();

        final UUID file = UUID.randomUUID();
        final Request request = Request.builder()
                .type(RequestType.builder().code(MrtmRequestType.EMP_NOTIFICATION).build())
                .payload(EmpNotificationRequestPayload.builder()
                        .payloadType(MrtmRequestType.EMP_NOTIFICATION)
                        .followUpResponse("the response")
                        .followUpResponseFiles(Set.of(file))
                        .followUpResponseAttachments(Map.of(file, "filename"))
                        .reviewDecision(reviewDecision)
                        .followUpReviewDecision(followUpReviewDecision)
                        .followUpReviewSectionsCompleted(Map.of("section", "accepted"))
                        .followUpSectionsCompleted(Map.of("followUpSection", "accepted"))
                        .build())
                .build();

        final EmpNotificationFollowUpApplicationReviewRequestTaskPayload expected =
                EmpNotificationFollowUpApplicationReviewRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_REVIEW_PAYLOAD)
                        .submissionDate(LocalDate.now())
                        .followUpRequest("the request")
                        .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                        .followUpResponse("the response")
                        .followUpFiles(Set.of(file))
                        .followUpAttachments(Map.of(file, "filename"))
                        .sectionsCompleted(Map.of("section", "accepted"))
                        .reviewDecision(followUpReviewDecision)
                        .build();

        final RequestTaskPayload actual = initializer.initializePayload(request);

        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes())
                .isEqualTo(Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_REVIEW));
    }
}

