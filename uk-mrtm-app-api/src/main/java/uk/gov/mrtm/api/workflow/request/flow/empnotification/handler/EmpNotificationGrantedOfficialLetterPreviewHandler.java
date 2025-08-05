package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.PreviewOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionDetails;
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
public class EmpNotificationGrantedOfficialLetterPreviewHandler extends PreviewDocumentAbstractHandler {

    private final PreviewOfficialNoticeService previewOfficialNoticeService;
    private final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;
    public EmpNotificationGrantedOfficialLetterPreviewHandler(final RequestTaskService requestTaskService,
                                                              final PreviewOfficialNoticeService previewOfficialNoticeService,
                                                              final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator) {
        super(requestTaskService);
        this.previewOfficialNoticeService = previewOfficialNoticeService;
        this.fileDocumentGenerateServiceDelegator = fileDocumentGenerateServiceDelegator;
    }

    @Override
    protected FileDTO generateDocument(Long taskId, DecisionNotification decisionNotification) {

        final RequestTask requestTask = requestTaskService.findTaskById(taskId);
        final Request request = requestTask.getRequest();
        final EmpNotificationApplicationReviewRequestTaskPayload taskPayload = (EmpNotificationApplicationReviewRequestTaskPayload) requestTask.getPayload();
        final TemplateParams templateParams = previewOfficialNoticeService.generateCommonParams(request, decisionNotification);

        final Map<String, Object> params = this.constructParams(taskPayload);
        templateParams.getParams().putAll(params);

        return fileDocumentGenerateServiceDelegator.generateFileDocument(
                MrtmDocumentTemplateType.EMP_NOTIFICATION_ACCEPTED,
                templateParams,
                "EMP Notification Acknowledgement Letter.pdf");
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmDocumentTemplateType.EMP_NOTIFICATION_ACCEPTED);
    }

    @Override
    protected List<String> getTaskTypes() {
        return List.of(
            MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_REVIEW,
            MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_NOTIFICATION_WAIT_FOR_PEER_REVIEW
        );
    }

    private Map<String, Object> constructParams(final EmpNotificationApplicationReviewRequestTaskPayload payload) {

        return Map.of("officialNotice",
            ((EmpNotificationReviewDecisionDetails) payload.getReviewDecision().getDetails()).getOfficialNotice());
    }
}
