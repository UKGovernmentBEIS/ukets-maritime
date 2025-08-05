package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseJustification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class NonComplianceInitialPenaltyNoticeApplyServiceTest {

    @InjectMocks
    private NonComplianceInitialPenaltyNoticeApplyService service;

    @Test
    void applySaveAction() {

        final NonComplianceInitialPenaltyNoticeRequestTaskPayload taskPayload =
            NonComplianceInitialPenaltyNoticeRequestTaskPayload.builder().build();
        final RequestTask requestTask = RequestTask.builder().payload(taskPayload).build();
        final Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        final UUID initialPenaltyNotice = UUID.randomUUID();
        final String comments = "comments";
        final NonComplianceInitialPenaltyNoticeSaveApplicationRequestTaskActionPayload taskActionPayload =
            NonComplianceInitialPenaltyNoticeSaveApplicationRequestTaskActionPayload.builder()
                .initialPenaltyNotice(initialPenaltyNotice)
                .comments(comments)
                .sectionsCompleted(sectionsCompleted)
                .build();

        service.applySaveAction(requestTask, taskActionPayload);

        NonComplianceInitialPenaltyNoticeRequestTaskPayload expectedTaskPayload =
            NonComplianceInitialPenaltyNoticeRequestTaskPayload.builder()
                .initialPenaltyNotice(initialPenaltyNotice)
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
        final UUID initialPenaltyNotice = UUID.randomUUID();
        final Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        final String comments = "comments";
        final NonComplianceInitialPenaltyNoticeRequestTaskPayload taskPayload =
            NonComplianceInitialPenaltyNoticeRequestTaskPayload.builder()
                .initialPenaltyNotice(initialPenaltyNotice)
                .comments(comments)
                .closeJustification(mock(NonComplianceCloseJustification.class))
                .nonComplianceAttachments(attachments)
                .sectionsCompleted(sectionsCompleted)
                .build();

        final RequestTask requestTask = RequestTask.builder()
            .payload(taskPayload)
            .request(Request.builder().payload(NonComplianceRequestPayload.builder().build()).build())
            .build();

        final NonComplianceRequestPayload expectedRequestPayload = NonComplianceRequestPayload.builder()
            .initialPenaltyNotice(initialPenaltyNotice)
            .initialPenaltyComments(comments)
            .nonComplianceAttachments(attachments)
            .regulatorPeerReviewer(peerReviewer)
            .initialPenaltySectionsCompleted(sectionsCompleted)
            .regulatorReviewer(regulatorReviewer)
            .build();

        service.saveRequestPeerReviewAction(requestTask, peerReviewer, regulatorReviewer);


        assertEquals(expectedRequestPayload, requestTask.getRequest().getPayload());
    }
}
