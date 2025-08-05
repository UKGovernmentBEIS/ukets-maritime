package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;


@ExtendWith(MockitoExtension.class)
class NonComplianceCivilPenaltyPeerReviewInitializerTest {

    @InjectMocks
    private NonComplianceCivilPenaltyPeerReviewInitializer initializer;

    @Test
    void initializePayload() {
        String comments = "comments";
        UUID civilPenalty = UUID.randomUUID();
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename.txt");
        Map<String, String> sectionsCompleted = Map.of("B", "COMPLETED");
        String penaltyAmount = "1";
        LocalDate civilPenaltyDueDate = LocalDate.now();

        final Request request = Request.builder()
            .payload(NonComplianceRequestPayload.builder()
                .reIssueCivilPenalty(false)
                .civilPenalty(civilPenalty)
                .civilPenaltyAmount(penaltyAmount)
                .civilPenaltyDueDate(civilPenaltyDueDate)
                .civilPenaltyComments(comments)
                .nonComplianceAttachments(attachments)
                .civilPenaltySectionsCompleted(sectionsCompleted)
                .build()
            )
            .build();

        final RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertEquals(requestTaskPayload, NonComplianceCivilPenaltyRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.NON_COMPLIANCE_CIVIL_PENALTY_APPLICATION_PEER_REVIEW_PAYLOAD)
            .civilPenalty(civilPenalty)
            .penaltyAmount(penaltyAmount)
            .dueDate(civilPenaltyDueDate)
            .comments(comments)
            .nonComplianceAttachments(attachments)
            .sectionsCompleted(sectionsCompleted)
            .build());
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsExactlyInAnyOrder(
            MrtmRequestTaskType.NON_COMPLIANCE_CIVIL_PENALTY_APPLICATION_PEER_REVIEW);
    }

}
