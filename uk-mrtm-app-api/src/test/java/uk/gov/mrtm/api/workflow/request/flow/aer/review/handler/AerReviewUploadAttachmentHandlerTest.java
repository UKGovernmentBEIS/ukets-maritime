package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.service.AerReviewUploadAttachmentService;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AerReviewUploadAttachmentHandlerTest {

    @InjectMocks
    private AerReviewUploadAttachmentHandler handler;

    @Mock
    private AerReviewUploadAttachmentService uploadAttachmentService;

    @Test
    void uploadAttachment() {

        final Long requestTaskId = 1L;
        final String filename = "filename";
        final String uuid = UUID.randomUUID().toString();

        handler.uploadAttachment(requestTaskId, uuid, filename);
        verify(uploadAttachmentService).uploadAttachment(requestTaskId, uuid, filename);
        verifyNoMoreInteractions(uploadAttachmentService);
    }

    @Test
    void getType() {
        assertEquals(MrtmRequestTaskActionType.AER_UPLOAD_REVIEW_GROUP_DECISION_ATTACHMENT, handler.getType());
    }
}
