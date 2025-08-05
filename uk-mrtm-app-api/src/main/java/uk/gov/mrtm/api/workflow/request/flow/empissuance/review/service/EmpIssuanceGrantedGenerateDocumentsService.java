package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.common.utils.ConcurrencyUtils;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Log4j2
@Service
@RequiredArgsConstructor
public class EmpIssuanceGrantedGenerateDocumentsService {

    private final RequestService requestService;

    private final EmpIssuanceCreateEmpDocumentService empIssuanceCreateEmpDocumentService;

    private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

    private final EmissionsMonitoringPlanService emissionsMonitoringPlanService;

    private final EmpIssuanceOfficialNoticeService empIssuanceOfficialNoticeService;

    @Transactional
    public void generateDocuments(String requestId) {
        CompletableFuture<FileInfoDTO> empDocumentFuture = null;
        CompletableFuture<FileInfoDTO> officialNoticeFuture = null;
        CompletableFuture<Void> allFutures = null;

        try {
            empDocumentFuture = empIssuanceCreateEmpDocumentService.create(requestId);
            officialNoticeFuture = empIssuanceOfficialNoticeService.generateGrantedOfficialNotice(requestId);

            allFutures = CompletableFuture.allOf(empDocumentFuture, officialNoticeFuture);
            allFutures.get();

            final FileInfoDTO empDocument = empDocumentFuture.get();
            final FileInfoDTO officialNotice = officialNoticeFuture.get();

            final Request request = requestService.findRequestById(requestId);
            final EmpIssuanceRequestPayload requestPayload = (EmpIssuanceRequestPayload) request.getPayload();
            final EmissionsMonitoringPlanDTO empDto = emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDTOByAccountId(request.getAccountId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

            requestPayload.setEmpDocument(empDocument);
            requestPayload.setOfficialNotice(officialNotice);

            emissionsMonitoringPlanService.setFileDocumentUuid(empDto.getId(), empDocument.getUuid());
        } catch (ExecutionException e) {
            Throwable caused = e.getCause();
            if (caused.getClass() == BusinessException.class) {
                throw (BusinessException) caused;
            } else {
                log.error(caused.getMessage());
                throw new BusinessException(ErrorCode.INTERNAL_SERVER, caused);
            }
        } catch (InterruptedException e) {
            Throwable caused = e.getCause();
            log.error(e.getMessage());
            Thread.currentThread().interrupt();
            throw new BusinessException(ErrorCode.INTERNAL_SERVER, caused);
        } catch (Exception e) {
            Throwable caused = e.getCause();
            log.error(e.getMessage());
            throw new BusinessException(ErrorCode.INTERNAL_SERVER, caused);
        } finally {
            ConcurrencyUtils.completeCompletableFutures(empDocumentFuture, officialNoticeFuture, allFutures);

        }
    }
}
