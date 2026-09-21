package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.integration.external.common.domain.BaseStagingEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataJobEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataTransactionEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataJobRepository;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult.SCHEDULED;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ImportThirdPartyDataJobQueryService {

    private final ImportThirdPartyDataJobRepository repository;
    private final ImportThirdPartyDataTransactionQueryService transactionQueryService;
    private final MrtmAccountQueryService mrtmAccountQueryService;

    public Set<Long> createJobs(long transactionId, List<BaseStagingEntity> items) {
        ImportThirdPartyDataTransactionEntity transaction = transactionQueryService.getTransactionById(transactionId);
        List<ImportThirdPartyDataJobEntity> jobs = new ArrayList<>();

        items.forEach(
            item -> {
                MrtmAccount account = mrtmAccountQueryService.getAccountById(item.getAccountId());

                jobs.add(ImportThirdPartyDataJobEntity.builder()
                    .status(SCHEDULED)
                    .stagingDataId(item.getId())
                    .transaction(transaction)
                    .account(account)
                    .build());
            }
        );

        List<ImportThirdPartyDataJobEntity> importThirdPartyDataJobEntities = repository.saveAll(jobs);
        return importThirdPartyDataJobEntities.stream().map(ImportThirdPartyDataJobEntity::getId).collect(Collectors.toSet());
    }

    @Transactional
    public ImportThirdPartyDataJobEntity getJobByIdForUpdate(Long id) {
        return repository.findByIdForUpdate(id)
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }
}
