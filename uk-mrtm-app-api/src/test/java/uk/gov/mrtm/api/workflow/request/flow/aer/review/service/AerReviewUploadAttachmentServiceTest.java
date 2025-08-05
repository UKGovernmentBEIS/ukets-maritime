package uk.gov.mrtm.api.workflow.request.flow.aer.review.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerReviewUploadAttachmentServiceTest {

    @InjectMocks
    private AerReviewUploadAttachmentService uploadAttachmentService;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void uploadAttachment() {
        Long requestTaskId = 1L;
        String fileName = "fileName";
        AerApplicationReviewRequestTaskPayload requestTaskPayload = AerApplicationReviewRequestTaskPayload.builder().build();
        RequestTask requestTask = RequestTask.builder()
                .id(requestTaskId)
                .payload(requestTaskPayload)
                .build();
        String attachmentUuid = UUID.randomUUID().toString();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        uploadAttachmentService.uploadAttachment(requestTaskId, attachmentUuid, fileName);

        verify(requestTaskService).findTaskById(requestTaskId);

        assertThat(requestTaskPayload.getReviewAttachments()).containsEntry(UUID.fromString(attachmentUuid), fileName);
    }
}
