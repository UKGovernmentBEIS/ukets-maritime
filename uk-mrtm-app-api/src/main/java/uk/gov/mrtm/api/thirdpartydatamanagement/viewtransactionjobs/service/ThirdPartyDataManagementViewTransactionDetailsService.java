package uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataJobRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataTransactionRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.domain.ThirdPartyDataManagementJobItem;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.domain.ThirdPartyDataManagementTransactionDetailsResponseDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionItem;
import uk.gov.netz.api.authorization.core.domain.AppUser;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThirdPartyDataManagementViewTransactionDetailsService {

    private final ImportThirdPartyDataJobRepository jobRepository;
    private final ImportThirdPartyDataTransactionRepository transactionRepository;

    public ThirdPartyDataManagementTransactionDetailsResponseDTO findImportTransactionDetails(
        AppUser appUser, long transactionId) {

        ThirdPartyDataManagementTransactionItem transaction = transactionRepository.findImportTransaction(transactionId);

        List<ThirdPartyDataManagementJobItem> jobs = jobRepository.findAllByTransactionIdAndAccountIds(transactionId, appUser.getAccounts());

        return ThirdPartyDataManagementTransactionDetailsResponseDTO.builder()
            .transaction(transaction)
            .jobs(jobs)
            .build();
    }

}