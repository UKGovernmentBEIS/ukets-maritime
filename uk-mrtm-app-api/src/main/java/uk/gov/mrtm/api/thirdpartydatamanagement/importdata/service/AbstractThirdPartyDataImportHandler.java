package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.external.common.domain.BaseStagingEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.List;
import java.util.Set;

@Log4j2
@RequiredArgsConstructor
public abstract class AbstractThirdPartyDataImportHandler<T extends BaseStagingEntity>
    implements ThirdPartyDataManagementImportHandler {

    private final ImportThirdPartyDataJobQueryService jobQueryService;

    protected abstract T findStagingEntityForUpdate(long stagingDataId);

    protected abstract List<T> findAllByStagingId(ThirdPartyDataManagementImportRequestDTO requestDTO);

    protected abstract ThirdPartyDataManagementImportResult performImport(T stagingEntity, String userId);

    @Override
    @Transactional
    public ThirdPartyDataManagementImportResult importData(long stagingDataId, String userId) {

        T stagingEntity = findStagingEntityForUpdate(stagingDataId);

        ThirdPartyDataManagementImportResult importResult;
        try {
            importResult = performImport(stagingEntity, userId);
        } catch (Exception e) {
            log.error("Failed to import staging data ID: {} for job Id: {}", stagingDataId, e);
            importResult = ThirdPartyDataManagementImportResult.GENERIC_ERROR;
        }

        return importResult;
    }

    @Override
    public Set<Long> createImportBatch(long transactionId, ThirdPartyDataManagementImportRequestDTO requestDTO) {
        List<T> stagingEntities = findAllByStagingId(requestDTO);

        if (stagingEntities.isEmpty() || requestDTO.getItems().size() != stagingEntities.size()) {
            log.error("Some staging IDs do not exist! Given IDs: {}", requestDTO.getItems());
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
        }

        return jobQueryService.createJobs(transactionId, (List<BaseStagingEntity>) stagingEntities);
    }
}
