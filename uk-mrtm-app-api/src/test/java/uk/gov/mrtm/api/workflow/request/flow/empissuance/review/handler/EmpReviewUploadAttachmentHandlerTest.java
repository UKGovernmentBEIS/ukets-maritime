package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.EmpReviewUploadAttachmentService;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class EmpReviewUploadAttachmentHandlerTest {

    @InjectMocks
    private EmpReviewUploadAttachmentHandler handler;

    @Mock
    private EmpReviewUploadAttachmentService empReviewUploadAttachmentService;

    @Test
    void uploadAttachment() {
        Long requestTaskId = 1L;
        String filename = "name";
        String attachmentUuid = UUID.randomUUID().toString();

        //invoke
        handler.uploadAttachment(requestTaskId, attachmentUuid, filename);

        verify(empReviewUploadAttachmentService, times(1))
            .uploadAttachment(requestTaskId, attachmentUuid, filename);
        verifyNoMoreInteractions(empReviewUploadAttachmentService);
    }

    @Test
    void getType() {
        assertThat(handler.getType()).isEqualTo(MrtmRequestTaskActionType.EMP_ISSUANCE_UPLOAD_REVIEW_GROUP_DECISION_ATTACHMENT);
    }
}