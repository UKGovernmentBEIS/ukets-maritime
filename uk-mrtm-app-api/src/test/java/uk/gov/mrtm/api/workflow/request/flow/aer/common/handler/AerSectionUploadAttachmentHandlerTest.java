package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSectionUploadAttachmentService;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AerSectionUploadAttachmentHandlerTest {

    @InjectMocks
    private AerSectionUploadAttachmentHandler aerSectionUploadAttachmentHandler;

    @Mock
    private AerSectionUploadAttachmentService aerSectionUploadAttachmentService;

    @Test
    void uploadAttachment() {
        Long requestTaskId = 1L;
        String filename = "filename";
        String attachmentUuid = UUID.randomUUID().toString();

        aerSectionUploadAttachmentHandler.uploadAttachment(requestTaskId, attachmentUuid, filename);

        verify(aerSectionUploadAttachmentService, times(1))
            .uploadAttachment(requestTaskId, attachmentUuid, filename);
    }

    @Test
    void getType() {
        assertEquals(MrtmRequestTaskActionType.AER_UPLOAD_SECTION_ATTACHMENT, aerSectionUploadAttachmentHandler.getType());
    }
}