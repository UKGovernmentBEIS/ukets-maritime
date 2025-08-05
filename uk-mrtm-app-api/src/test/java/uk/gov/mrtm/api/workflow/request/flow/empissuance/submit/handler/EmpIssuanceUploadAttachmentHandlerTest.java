package uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.service.EmpIssuanceUploadAttachmentService;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;


@ExtendWith(MockitoExtension.class)
class EmpIssuanceUploadAttachmentHandlerTest {

    @InjectMocks
    private EmpIssuanceUploadAttachmentHandler handler;

    @Mock
    private EmpIssuanceUploadAttachmentService uploadAttachmentService;

    @Test
    void uploadAttachment() {

        final Long requestTaskId = 1L;
        final String filename = "filename";
        final String attachmentUuid = UUID.randomUUID().toString();

        handler.uploadAttachment(requestTaskId, attachmentUuid, filename);

        verify(uploadAttachmentService).uploadAttachment(requestTaskId, attachmentUuid, filename);
        verifyNoMoreInteractions(uploadAttachmentService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getType()).isEqualTo(MrtmRequestTaskActionType.EMP_ISSUANCE_UPLOAD_SECTION_ATTACHMENT);
    }
}
