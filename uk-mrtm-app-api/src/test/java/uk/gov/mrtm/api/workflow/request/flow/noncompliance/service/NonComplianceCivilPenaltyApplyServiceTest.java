package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltySaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseJustification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class NonComplianceCivilPenaltyApplyServiceTest {

    @InjectMocks
    private NonComplianceCivilPenaltyApplyService service;

    @Test
    void applySaveAction() {

        final NonComplianceCivilPenaltyRequestTaskPayload taskPayload =
            NonComplianceCivilPenaltyRequestTaskPayload.builder().build();
        final RequestTask requestTask = RequestTask.builder().payload(taskPayload).build();
        final Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        final UUID civilPenalty = UUID.randomUUID();
        final String comments = "comments";
        final String penaltyAmount = "penaltyAmount";
        LocalDate dueDate = LocalDate.now();
        final NonComplianceCivilPenaltySaveApplicationRequestTaskActionPayload taskActionPayload =
            NonComplianceCivilPenaltySaveApplicationRequestTaskActionPayload.builder()
                .civilPenalty(civilPenalty)
                .comments(comments)
                .penaltyAmount(penaltyAmount)
                .dueDate(dueDate)
                .sectionsCompleted(sectionsCompleted)
                .build();

        service.applySaveAction(requestTask, taskActionPayload);

        NonComplianceCivilPenaltyRequestTaskPayload expectedTaskPayload =
            NonComplianceCivilPenaltyRequestTaskPayload.builder()
                .civilPenalty(civilPenalty)
                .penaltyAmount(penaltyAmount)
                .dueDate(dueDate)
                .sectionsCompleted(sectionsCompleted)
                .comments(comments)
                .build();

        assertEquals(expectedTaskPayload, taskPayload);
    }

    @Test
    void saveRequestPeerReviewAction() {
        final String peerReviewer = "peerReviewer";
        final String regulatorReviewer = "regulatorReviewer";
        final Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename");
        final UUID civilPenalty = UUID.randomUUID();
        final Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        final String comments = "comments";
        String penaltyAmount = "1";
        LocalDate civilPenaltyDueDate = LocalDate.now();

        final NonComplianceCivilPenaltyRequestTaskPayload taskPayload =
            NonComplianceCivilPenaltyRequestTaskPayload.builder()
                .civilPenalty(civilPenalty)
                .comments(comments)
                .penaltyAmount(penaltyAmount)
                .dueDate(civilPenaltyDueDate)
                .closeJustification(mock(NonComplianceCloseJustification.class))
                .nonComplianceAttachments(attachments)
                .sectionsCompleted(sectionsCompleted)
                .build();

        final RequestTask requestTask = RequestTask.builder()
            .payload(taskPayload)
            .request(Request.builder().payload(NonComplianceRequestPayload.builder().build()).build())
            .build();

        final NonComplianceRequestPayload expectedRequestPayload = NonComplianceRequestPayload.builder()
            .civilPenalty(civilPenalty)
            .civilPenaltyComments(comments)
            .nonComplianceAttachments(attachments)
            .regulatorPeerReviewer(peerReviewer)
            .civilPenaltySectionsCompleted(sectionsCompleted)
            .civilPenaltyAmount(penaltyAmount)
            .civilPenaltyDueDate(civilPenaltyDueDate)
            .regulatorReviewer(regulatorReviewer)
            .build();

        service.saveRequestPeerReviewAction(requestTask, peerReviewer, regulatorReviewer);

        assertEquals(expectedRequestPayload, requestTask.getRequest().getPayload());
    }
}
