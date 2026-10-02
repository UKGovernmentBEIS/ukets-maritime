package uk.gov.mrtm.api.workflow.request.flow.common.preview.async.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestTaskDocumentAsyncGeneratedDataPayload;
import uk.gov.mrtm.api.workflow.request.flow.common.emp.event.EmpReviewDocumentGenerateDto;
import uk.gov.mrtm.api.workflow.request.flow.common.emp.handler.EmpReviewDocumentGenerateService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateStage;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.service.AsyncPreviewDocumentAbstractHandler;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileStatus;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;

@Service
public class OfficialNoticePreviewHandler extends AsyncPreviewDocumentAbstractHandler {

    private final EmpReviewDocumentGenerateService empReviewDocumentGenerateService;

    public OfficialNoticePreviewHandler(final RequestTaskService requestTaskService,
                                        final EmpReviewDocumentGenerateService empReviewDocumentGenerateService) {
        super(requestTaskService);
        this.empReviewDocumentGenerateService = empReviewDocumentGenerateService;
    }

    @Override
    public RequestTaskPayload generateDocument(Long taskId, DecisionNotification decisionNotification) {

        RequestTask requestTask = requestTaskService.findTaskByIdForUpdate(taskId);
        RequestTaskDocumentAsyncGeneratedDataPayload requestTaskPayload =
            (RequestTaskDocumentAsyncGeneratedDataPayload) requestTask.getPayload();

        if(!requestTaskPayload.canPreviewOfficialDocument()) {
            throw new BusinessException(MrtmErrorCode.EMP_CANNOT_PREVIEW_OFFICIAL_NOTICE, taskId);
        }

        final String asyncJobId = empReviewDocumentGenerateService.generate(EmpReviewDocumentGenerateDto.builder()
            .type(RequestGeneratedFileType.OFFICIAL_NOTICE)
            .requestTaskId(taskId)
            .stage(DocumentTemplateStage.PREVIEW)
            .decisionNotification(decisionNotification)
            .build());

        requestTaskPayload.getPreviewFiles().put(RequestGeneratedFileType.OFFICIAL_NOTICE,
            RequestTaskPreviewFileInfoDTO.builder()
                .asyncJobId(asyncJobId)
                .status(RequestTaskPreviewFileStatus.IN_PROGRESS)
                .build());

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(RequestGeneratedFileType.OFFICIAL_NOTICE.name());
    }

    @Override
    protected List<String> getTaskTypes() {
        return List.of(
            MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_PEER_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS,

            MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_AMENDS,
            MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW,

            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_WAIT_FOR_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT
        );
    }
}
