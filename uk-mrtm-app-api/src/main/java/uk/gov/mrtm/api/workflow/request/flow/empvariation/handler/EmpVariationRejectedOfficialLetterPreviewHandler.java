package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.PreviewOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.service.PreviewDocumentAbstractHandler;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;
import java.util.Map;

@Service
public class EmpVariationRejectedOfficialLetterPreviewHandler extends PreviewDocumentAbstractHandler {

    private final PreviewOfficialNoticeService previewOfficialNoticeService;
    private final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;
    
    public EmpVariationRejectedOfficialLetterPreviewHandler(final RequestTaskService requestTaskService,
                                                            final PreviewOfficialNoticeService previewOfficialNoticeService,
                                                            final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator) {
        super(requestTaskService);
        this.previewOfficialNoticeService = previewOfficialNoticeService;
        this.fileDocumentGenerateServiceDelegator = fileDocumentGenerateServiceDelegator;
    }

    @Override
    protected FileDTO generateDocument(final Long taskId, final DecisionNotification decisionNotification) {

        final RequestTask requestTask = requestTaskService.findTaskById(taskId);
        final EmpVariationApplicationReviewRequestTaskPayload taskPayload =
            (EmpVariationApplicationReviewRequestTaskPayload) requestTask.getPayload();
        final Request request = requestTask.getRequest();

        final TemplateParams templateParams = previewOfficialNoticeService.generateCommonParams(request, decisionNotification);
        final String operatorName = taskPayload.getEmissionsMonitoringPlan().getOperatorDetails().getOperatorName();
        templateParams.getAccountParams().setName(operatorName);

        final Map<String, Object> variationParams = this.constructParams(taskPayload);
        templateParams.getParams().putAll(variationParams);

        return fileDocumentGenerateServiceDelegator.generateFileDocument(
            MrtmDocumentTemplateType.EMP_VARIATION_REJECTED,
            templateParams,
            "emp_variation_rejected.pdf"
        );
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmDocumentTemplateType.EMP_VARIATION_REJECTED);
    }

    @Override
    protected List<String> getTaskTypes() {
        return List.of(
            MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_AMENDS
        );
    }
    
    private Map<String, Object> constructParams(final EmpVariationApplicationReviewRequestTaskPayload taskPayload) {

        final String reason = taskPayload.getDetermination() != null && taskPayload.getDetermination().getReason() != null
            ? taskPayload.getDetermination().getReason() : "";
        final String summary = taskPayload.getDetermination() != null && taskPayload.getDetermination().getSummary() != null
            ? taskPayload.getDetermination().getSummary() : "";
        return Map.of("rejectionReason", reason,
                      "summary", summary);
    }
}
