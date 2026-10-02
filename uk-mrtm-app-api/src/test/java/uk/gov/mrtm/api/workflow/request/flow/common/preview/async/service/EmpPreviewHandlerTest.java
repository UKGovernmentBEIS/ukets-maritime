package uk.gov.mrtm.api.workflow.request.flow.common.preview.async.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.mrtm.api.workflow.request.flow.common.emp.event.EmpReviewDocumentGenerateDto;
import uk.gov.mrtm.api.workflow.request.flow.common.emp.handler.EmpReviewDocumentGenerateService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateStage;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileStatus;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpPreviewHandlerTest {


    @InjectMocks
    private EmpPreviewHandler cut;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private EmpReviewDocumentGenerateService empReviewDocumentGenerateService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String asyncJobId = "123";
        DecisionNotification decision = DecisionNotification.builder().signatory("sign").build();

        EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload = EmpVariationApplicationReviewRequestTaskPayload.builder()
            .build();

        EmpVariationApplicationReviewRequestTaskPayload expectedRequestTaskPayload = EmpVariationApplicationReviewRequestTaskPayload.builder()
            .previewFiles(Map.of(RequestGeneratedFileType.EMP,
                RequestTaskPreviewFileInfoDTO.builder()
                    .asyncJobId(asyncJobId)
                    .status(RequestTaskPreviewFileStatus.IN_PROGRESS)
                    .build()))
            .build();


        RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .payload(requestTaskPayload)
            .build();

        when(requestTaskService.findTaskByIdForUpdate(requestTaskId)).thenReturn(requestTask);

        when(empReviewDocumentGenerateService.generate(EmpReviewDocumentGenerateDto.builder()
            .type(RequestGeneratedFileType.EMP)
            .requestTaskId(requestTaskId)
            .stage(DocumentTemplateStage.PREVIEW)
            .decisionNotification(decision)
            .build()))
            .thenReturn(asyncJobId);

        RequestTaskPayload actual = cut.generateDocument(requestTaskId, decision);

        assertThat(actual).isEqualTo(expectedRequestTaskPayload);

        assertThat(requestTaskPayload.getPreviewFiles().get(RequestGeneratedFileType.EMP)).isEqualTo(
            RequestTaskPreviewFileInfoDTO.builder()
                .asyncJobId(asyncJobId)
                .status(RequestTaskPreviewFileStatus.IN_PROGRESS).build());

        verify(requestTaskService, times(1)).findTaskByIdForUpdate(requestTaskId);
        verify(empReviewDocumentGenerateService, times(1)).generate(EmpReviewDocumentGenerateDto.builder()
            .type(RequestGeneratedFileType.EMP)
            .requestTaskId(requestTask.getId())
            .stage(DocumentTemplateStage.PREVIEW)
            .decisionNotification(decision)
            .build());
    }

    @Test
    void getTaskTypes() {
        assertThat(cut.getTaskTypes())
            .containsExactly(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW,
                MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW,
                MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_PEER_REVIEW,
                MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS,

                MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_AMENDS,
                MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_PEER_REVIEW,
                MrtmRequestTaskType.EMP_VARIATION_APPLICATION_PEER_REVIEW,
                MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW,

                MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_WAIT_FOR_PEER_REVIEW,
                MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW,
                MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT);
    }

    @Test
    void getTypes() {
        assertThat(cut.getTypes())
            .containsExactly(RequestGeneratedFileType.EMP.name());
    }
}
