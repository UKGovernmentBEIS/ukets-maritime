package uk.gov.mrtm.api.emissionsmonitoringplan.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.files.documents.service.FileDocumentTokenService;
import uk.gov.netz.api.token.FileToken;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmpDocumentService {

    private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
    private final FileDocumentTokenService fileDocumentTokenService;

    public FileToken generateGetFileDocumentToken(final String empId,
                                                  final UUID documentUuid) {
        boolean exists = emissionsMonitoringPlanQueryService.existsContainerByIdAndFileDocumentUuid(empId, documentUuid.toString());

        if (!exists) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return fileDocumentTokenService.generateGetFileDocumentToken(documentUuid.toString());
    }
}
