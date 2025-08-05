package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationUploadAttachmentService;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class EmpNotificationUploadAttachmentHandlerTest {


    @InjectMocks
    private EmpNotificationUploadAttachmentHandler handler;

    @Mock
    private EmpNotificationUploadAttachmentService uploadAttachmentService;

    @Test
    void uploadAttachment() {
        Long requestTaskId = 1L;
        String filename = "filename";
        String attachmentUuid = UUID.randomUUID().toString();

        //invoke
        handler.uploadAttachment(requestTaskId, attachmentUuid, filename);

        verify(uploadAttachmentService).uploadAttachment(requestTaskId, attachmentUuid, filename);
        verifyNoMoreInteractions(uploadAttachmentService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getType()).isEqualTo(MrtmRequestTaskActionType.EMP_NOTIFICATION_UPLOAD_SECTION_ATTACHMENT);
    }
}