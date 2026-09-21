package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataTransactionEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataTransactionRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataTransactionStatus;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.utils.DateService;

import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ImportThirdPartyDataTransactionQueryService {

    private final DateService dateService;
    private final ImportThirdPartyDataTransactionRepository repository;

    public ImportThirdPartyDataTransactionEntity createTransaction(AppUser appUser, ThirdPartyDataManagementImportRequestDTO requestDTO) {

        return repository.save(ImportThirdPartyDataTransactionEntity.builder()
            .status(ThirdPartyDataTransactionStatus.IN_PROGRESS)
            .type(requestDTO.getRequestType())
            .year(requestDTO.getYear())
            .createdOn(dateService.getLocalDateTime())
            .submitterId(appUser.getUserId())
            .submitterName(appUser.getFullName())
            .build());
    }

    @Transactional
    public ImportThirdPartyDataTransactionEntity getTransactionById(long transactionId) {
        return repository.findById(transactionId)
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }
}
