package uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataTransactionRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionsResponseDTO;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.domain.PagingRequest;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ThirdPartyDataManagementViewTransactionsService {

    private final ImportThirdPartyDataTransactionRepository transactionRepository;

    public ThirdPartyDataManagementTransactionsResponseDTO findImportTransactions(
        AppUser appUser, PageRequest paging) {

        Set<Long> accountIds = appUser.getAccounts();

        return ThirdPartyDataManagementTransactionsResponseDTO.builder()
            .items(transactionRepository.findImportTransactionsByAccountId(accountIds, paging))
            .stats(transactionRepository.countTransactionStatusesForAccounts(accountIds))
            .build();
    }

}
