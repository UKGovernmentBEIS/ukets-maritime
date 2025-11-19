package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpWaitForAmendsRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
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
class EmpNotificationFollowUpWaitForAmendsInitializerTest {

    @InjectMocks
    private EmpNotificationFollowUpWaitForAmendsInitializer initializer;

    @Test
    void initializePayload() {

        final UUID amendFile = UUID.randomUUID();
        final UUID responseFile = UUID.randomUUID();
        final UUID nonRelevantFile = UUID.randomUUID();
        final EmpNotificationFollowUpReviewDecision reviewDecision = EmpNotificationFollowUpReviewDecision.builder()
            .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
            .details(
                EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                    .notes("the notes")
                    .dueDate(LocalDate.of(2023, 1, 1))
                    .requiredChanges(Collections.singletonList(
                        new ReviewDecisionRequiredChange("the changes required", Set.of(amendFile))))
                    .build()
            )
            .build();

        final Map<UUID, String> files = Map.of(amendFile, "amendFile", responseFile, "responseFile", nonRelevantFile, "non-relevant-filename");
        final Request request = Request.builder()
            .type(RequestType.builder().code(MrtmRequestType.EMP_NOTIFICATION).build())
            .payload(EmpNotificationRequestPayload.builder()
                .reviewDecision(
                    EmpNotificationReviewDecision.builder()
                        .details(
                            EmpNotificationAcceptedDecisionDetails.builder()
                                .officialNotice("officialNotice")
                                .followUp(FollowUp.builder()
                                    .followUpRequest("follow up request")
                                    .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                                    .build())
                                .build()
                        )
                        .build()
                )
                .followUpResponse("follow up response")
                .followUpResponseFiles(Set.of(responseFile))
                .followUpReviewDecision(reviewDecision)
                .followUpResponseAttachments(files)
                .build())
            .build();

        final EmpNotificationFollowUpWaitForAmendsRequestTaskPayload expected =
            EmpNotificationFollowUpWaitForAmendsRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_FOLLOW_UP_WAIT_FOR_AMENDS_PAYLOAD)
                .followUpRequest("follow up request")
                .followUpResponse("follow up response")
                .followUpFiles(Set.of(responseFile))
                .reviewDecision(reviewDecision)
                .followUpResponseAttachments(Map.of(amendFile, "amendFile", responseFile, "responseFile"))
                .build();

        final RequestTaskPayload actual = initializer.initializePayload(request);

        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes())
            .isEqualTo(Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP_WAIT_FOR_AMENDS));
    }
}