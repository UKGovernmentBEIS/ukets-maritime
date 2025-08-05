package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.EmpCreateDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationMapper;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class EmpVariationCreateEmpDocumentService {

    private final RequestService requestService;
    private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
    private final EmpCreateDocumentService empCreateDocumentService;
    private final EmpVariationMapper empVariationMapper = Mappers.getMapper(EmpVariationMapper.class);
    private final EmpVariationRequestQueryService empVariationRequestQueryService;
    private final DateService dateService;

    public CompletableFuture<FileInfoDTO> create(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();
        final String signatory = requestPayload.getDecisionNotification().getSignatory();
        final Long accountId = request.getAccountId();
        final EmissionsMonitoringPlanDTO emp = emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        final EmpVariationRequestInfo variationCurrentRequest =
            empVariationMapper.toEmpVariationRequestInfo(request, dateService.getLocalDateTime());
        final List<EmpVariationRequestInfo> variationHistoricalRequests =
            empVariationRequestQueryService.findEmpVariationRequests(accountId);

        List<EmpVariationRequestInfo> variationHistory = new ArrayList<>(variationHistoricalRequests);
        variationHistory.add(variationCurrentRequest);

        Request empRequest = emissionsMonitoringPlanQueryService.findApprovedByAccountId(accountId);

        return empCreateDocumentService.generateDocumentAsync(request,
            signatory,
            emp,
            MrtmDocumentTemplateType.EMP,
            variationHistory,
            empRequest.getSubmissionDate(),
            empRequest.getEndDate());
    }
}
