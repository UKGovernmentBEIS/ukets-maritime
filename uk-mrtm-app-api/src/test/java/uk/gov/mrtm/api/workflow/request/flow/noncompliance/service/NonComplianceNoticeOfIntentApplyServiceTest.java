package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseJustification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class NonComplianceNoticeOfIntentApplyServiceTest {

    @InjectMocks
    private NonComplianceNoticeOfIntentApplyService service;

    @Test
    void applySaveAction() {

        final NonComplianceNoticeOfIntentRequestTaskPayload taskPayload =
            NonComplianceNoticeOfIntentRequestTaskPayload.builder().build();
        final RequestTask requestTask = RequestTask.builder().payload(taskPayload).build();
        final Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        final UUID noticeOfIntent = UUID.randomUUID();
        final String comments = "comments";
        final NonComplianceNoticeOfIntentSaveApplicationRequestTaskActionPayload taskActionPayload =
            NonComplianceNoticeOfIntentSaveApplicationRequestTaskActionPayload.builder()
                .noticeOfIntent(noticeOfIntent)
                .comments(comments)
                .sectionsCompleted(sectionsCompleted)
                .build();

        service.applySaveAction(requestTask, taskActionPayload);

        NonComplianceNoticeOfIntentRequestTaskPayload expectedTaskPayload =
            NonComplianceNoticeOfIntentRequestTaskPayload.builder()
                .noticeOfIntent(noticeOfIntent)
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
        final UUID noticeOfIntent = UUID.randomUUID();
        final Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        final String comments = "comments";
        final NonComplianceNoticeOfIntentRequestTaskPayload taskPayload =
            NonComplianceNoticeOfIntentRequestTaskPayload.builder()
                .noticeOfIntent(noticeOfIntent)
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
            .noticeOfIntent(noticeOfIntent)
            .noticeOfIntentComments(comments)
            .nonComplianceAttachments(attachments)
            .regulatorPeerReviewer(peerReviewer)
            .noticeOfIntentSectionsCompleted(sectionsCompleted)
            .regulatorReviewer(regulatorReviewer)
            .build();

        service.saveRequestPeerReviewAction(requestTask, peerReviewer, regulatorReviewer);


        assertEquals(expectedRequestPayload, requestTask.getRequest().getPayload());
    }
}