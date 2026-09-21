package uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataJobRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataTransactionRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.domain.ThirdPartyDataManagementJobItem;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.domain.ThirdPartyDataManagementTransactionDetailsResponseDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionItem;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataManagementViewTransactionDetailsServiceTest {

    @InjectMocks
    private ThirdPartyDataManagementViewTransactionDetailsService service;

    @Mock
    private ImportThirdPartyDataTransactionRepository transactionRepository;
    @Mock
    private ImportThirdPartyDataJobRepository jobRepository;

    @Test
    void findImportTransactionDetails() {
        long accountId = 1L;
        long transactionId = 2L;
        AppUser appUser = AppUser.builder().authorities(List.of(AppAuthority.builder().accountId(accountId).build())).build();
        ThirdPartyDataManagementTransactionItem transaction = mock(ThirdPartyDataManagementTransactionItem.class);
        List<ThirdPartyDataManagementJobItem> jobs = List.of(mock(ThirdPartyDataManagementJobItem.class));
        ThirdPartyDataManagementTransactionDetailsResponseDTO expected = ThirdPartyDataManagementTransactionDetailsResponseDTO.builder()
            .transaction(transaction)
            .jobs(jobs)
            .build();

        when(transactionRepository.findImportTransaction(transactionId)).thenReturn(transaction);
        when(jobRepository.findAllByTransactionIdAndAccountIds(transactionId, Set.of(accountId))).thenReturn(jobs);

        ThirdPartyDataManagementTransactionDetailsResponseDTO actual = service.findImportTransactionDetails(appUser, transactionId);

        assertThat(expected).isEqualTo(actual);

        verify(transactionRepository).findImportTransaction(transactionId);
        verify(jobRepository).findAllByTransactionIdAndAccountIds(transactionId, Set.of(accountId));
        verifyNoMoreInteractions(jobRepository, transactionRepository);
    }
}