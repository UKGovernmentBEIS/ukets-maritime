package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.PreviewOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.service.PreviewDocumentAbstractHandler;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class EmpVariationRegulatorLedApprovedOfficialLetterPreviewHandler extends PreviewDocumentAbstractHandler {

    private final PreviewOfficialNoticeService previewOfficialNoticeService;
    private final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;
    private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

    public EmpVariationRegulatorLedApprovedOfficialLetterPreviewHandler(final RequestTaskService requestTaskService,
                                                                        final PreviewOfficialNoticeService previewOfficialNoticeService,
                                                                        final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator,
                                                                        final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService) {
        super(requestTaskService);
        this.previewOfficialNoticeService = previewOfficialNoticeService;
        this.fileDocumentGenerateServiceDelegator = fileDocumentGenerateServiceDelegator;
        this.emissionsMonitoringPlanQueryService = emissionsMonitoringPlanQueryService;
    }

    @Override
    protected FileDTO generateDocument(final Long taskId, final DecisionNotification decisionNotification) {

        final RequestTask requestTask = requestTaskService.findTaskById(taskId);
        final EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload taskPayload =
            (EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload) requestTask.getPayload();
        final Request request = requestTask.getRequest();

        final TemplateParams templateParams = previewOfficialNoticeService.generateCommonParams(request, decisionNotification);
        final String operatorName = taskPayload.getEmissionsMonitoringPlan().getOperatorDetails().getOperatorName();
        templateParams.getAccountParams().setName(operatorName);

        final Map<String, Object> variationParams = this.constructParams(taskPayload, request.getAccountId());
        templateParams.getParams().putAll(variationParams);

        return fileDocumentGenerateServiceDelegator.generateFileDocument(
            MrtmDocumentTemplateType.EMP_VARIATION_REGULATOR_LED_APPROVED,
            templateParams,
            "emp_variation_approved.pdf"
        );
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmDocumentTemplateType.EMP_VARIATION_REGULATOR_LED_APPROVED);
    }

    @Override
    protected List<String> getTaskTypes() {
        return List.of(
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_WAIT_FOR_PEER_REVIEW
        );
    }
    
    private Map<String, Object> constructParams(final EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload taskPayload,
                                                final Long accountId) {

        final TreeMap<EmpReviewGroup, EmpAcceptedVariationDecisionDetails> sortedDecisions =
            new TreeMap<>(taskPayload.getReviewGroupDecisions());

        final List<String> reviewGroupsVariationScheduleItems = sortedDecisions
            .values()
            .stream()
            .map(EmpAcceptedVariationDecisionDetails::getVariationScheduleItems)
            .flatMap(List::stream)
            .toList();

        final int consolidationNumber =
            emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanConsolidationNumberByAccountId(accountId) + 1;

        EmpVariationRegulatorLedReason reasonRegulatorLed = taskPayload.getReasonRegulatorLed();

        final Map<String, Object> params = new HashMap<>();
        params.put("empConsolidationNumber", consolidationNumber);
        params.put("variationScheduleItems", reviewGroupsVariationScheduleItems);
        params.put("reason", reasonRegulatorLed != null ? reasonRegulatorLed.getDocumentReason() : "");

        return params;
    }
}
