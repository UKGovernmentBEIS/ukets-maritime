package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.common.service.PreviewOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.service.PreviewDocumentAbstractHandler;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;


@Service
public abstract class EmpIssuanceOfficialLetterPreviewHandler extends PreviewDocumentAbstractHandler {

    private final PreviewOfficialNoticeService previewOfficialNoticeService;

    protected EmpIssuanceOfficialLetterPreviewHandler(RequestTaskService requestTaskService,
                                                   PreviewOfficialNoticeService previewOfficialNoticeService) {
        super(requestTaskService);
        this.previewOfficialNoticeService = previewOfficialNoticeService;
    }

    protected TemplateParams constructTemplateParams(final long taskId,
                                                     final DecisionNotification decisionNotification) {
        final RequestTask requestTask = requestTaskService.findTaskById(taskId);
        final Request request = requestTask.getRequest();
        final TemplateParams templateParams = previewOfficialNoticeService
                .generateCommonParams(request, decisionNotification);
        final String operatorName = ((EmpIssuanceApplicationReviewRequestTaskPayload) (requestTask.getPayload()))
            .getEmissionsMonitoringPlan().getOperatorDetails().getOperatorName();
        templateParams.getAccountParams().setName(operatorName);

        return templateParams;
    }
}
