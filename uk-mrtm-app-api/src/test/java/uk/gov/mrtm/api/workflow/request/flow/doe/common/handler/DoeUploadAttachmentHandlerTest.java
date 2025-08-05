package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.service.DoeUploadAttachmentService;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class DoeUploadAttachmentHandlerTest {

    @InjectMocks
    private DoeUploadAttachmentHandler doeUploadAttachmentHandler;

    @Mock
    private DoeUploadAttachmentService doeUploadAttachmentService;

    @Test
    void uploadAttachment() {
        Long requestTaskId = 1L;
        String filename = "filename";
        String attachmentUuid = UUID.randomUUID().toString();

        doeUploadAttachmentHandler.uploadAttachment(requestTaskId, attachmentUuid, filename);

        verify(doeUploadAttachmentService, times(1))
                .uploadAttachment(requestTaskId, attachmentUuid, filename);
    }

    @Test
    void getType() {
        assertEquals(MrtmRequestTaskActionType.DOE_UPLOAD_ATTACHMENT, doeUploadAttachmentHandler.getType());
    }
}
