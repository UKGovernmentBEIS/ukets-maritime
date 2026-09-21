package uk.gov.mrtm.api.workflow.request.flow.rfi.handler;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.RfiRdePreviewOfficialNoticeService;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateType;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

@ExtendWith(MockitoExtension.class)
class RfiOfficialLetterPreviewHandlerTest {

    private RfiOfficialLetterPreviewHandler cut;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RfiRdePreviewOfficialNoticeService rfiRdePreviewOfficialNoticeService;

    @BeforeEach
    void setUp() {
        cut = new RfiOfficialLetterPreviewHandler(requestTaskService, rfiRdePreviewOfficialNoticeService);
    }

    @Test
    void previewDocument() {
        Long taskId = 1L;
        DecisionNotification decisionNotification = DecisionNotification.builder().signatory("signatory").build();
        RequestTask requestTask = RequestTask.builder()
                .id(taskId)
                .type(RequestTaskType.builder().code(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW).build())
                .build();
        FileDTO fileDTO = FileDTO.builder().fileName("preview.pdf").build();

        when(requestTaskService.findTaskById(taskId)).thenReturn(requestTask);
        when(rfiRdePreviewOfficialNoticeService.generateRfiPreview(requestTask, decisionNotification)).thenReturn(fileDTO);

        assertThat(cut.previewDocument(taskId, decisionNotification)).isEqualTo(fileDTO);
        verify(rfiRdePreviewOfficialNoticeService, times(1)).generateRfiPreview(requestTask, decisionNotification);
    }

    @Test
    void getTypes() {
        assertThat(cut.getTypes()).containsExactly(DocumentTemplateType.IN_RFI);
    }
}
