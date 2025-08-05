package uk.gov.mrtm.api.workflow.request.flow.empvariation.common;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler.EmpPreviewCreateEmpDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler.EmpPreviewDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationMapper;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationRequestQueryService;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
public abstract class EmpVariationPreviewEmpDocumentService implements EmpPreviewDocumentService {

    private final RequestTaskService requestTaskService;
    private final EmpPreviewCreateEmpDocumentService empPreviewCreateEmpDocumentService;
    private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
    private final EmpVariationRequestQueryService empVariationRequestQueryService;
    private final EmpVariationMapper empVariationMapper = Mappers.getMapper(EmpVariationMapper.class);
    private final DateService dateService;

    @Transactional(readOnly = true)
    public FileDTO create(final Long taskId, final DecisionNotification decisionNotification) {

        final RequestTask requestTask = requestTaskService.findTaskById(taskId);
        final EmpVariationApplicationSubmitRequestTaskPayload taskPayload =
            (EmpVariationApplicationSubmitRequestTaskPayload) requestTask.getPayload();
        final Request request = requestTask.getRequest();
        final Long accountId = request.getAccountId();

        final EmissionsMonitoringPlan emp = taskPayload.getEmissionsMonitoringPlan();
        final Map<UUID, String> attachments = taskPayload.getAttachments();

        final int consolidationNumber = 
            emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanConsolidationNumberByAccountId(accountId) + 1;

        final EmpVariationRequestInfo variationCurrentRequest =
            empVariationMapper.toEmpVariationRequestInfo(request, dateService.getLocalDateTime());

        // In case of preview, consolidation number is not yet generated. That's why it has to be set manually.
        variationCurrentRequest.getMetadata().setEmpConsolidationNumber(consolidationNumber);
        variationCurrentRequest.getMetadata().setSummary(getSummary(requestTask.getPayload()));

        final List<EmpVariationRequestInfo> variationHistoricalRequests =
            empVariationRequestQueryService.findEmpVariationRequests(accountId);

        List<EmpVariationRequestInfo> variationHistory = new ArrayList<>(variationHistoricalRequests);
        variationHistory.add(variationCurrentRequest);

        Request empRequest = emissionsMonitoringPlanQueryService.findApprovedByAccountId(accountId);

        return empPreviewCreateEmpDocumentService.getFile(
            decisionNotification,
            request,
            accountId,
            emp,
            attachments,
            variationHistory,
            consolidationNumber,
            empRequest.getSubmissionDate(),
            empRequest.getEndDate());
    }

    public abstract String getSummary(RequestTaskPayload requestPayload);

}
