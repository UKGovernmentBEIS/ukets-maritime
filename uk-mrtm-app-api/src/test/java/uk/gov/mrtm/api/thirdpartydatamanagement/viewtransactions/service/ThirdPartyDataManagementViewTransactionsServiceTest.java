package uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataTransactionRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionItem;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionStats;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionsResponseDTO;
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
class ThirdPartyDataManagementViewTransactionsServiceTest {

    @InjectMocks
    private ThirdPartyDataManagementViewTransactionsService service;

    @Mock
    private ImportThirdPartyDataTransactionRepository transactionRepository;

    @Test
    void findImportTransactions() {
        PageRequest paging = mock(PageRequest.class);
        List<ThirdPartyDataManagementTransactionItem> items = List.of(mock(ThirdPartyDataManagementTransactionItem.class));
        ThirdPartyDataManagementTransactionStats stats = mock(ThirdPartyDataManagementTransactionStats.class);
        ThirdPartyDataManagementTransactionsResponseDTO responseDTO =
            ThirdPartyDataManagementTransactionsResponseDTO.builder().stats(stats).items(items).build();

        Long accountId = 1L;
        AppUser appUser = AppUser.builder().authorities(List.of(AppAuthority.builder().accountId(accountId).build())).build();

        when(transactionRepository.findImportTransactionsByAccountId(Set.of(accountId), paging)).thenReturn(items);
        when(transactionRepository.countTransactionStatusesForAccounts(Set.of(accountId))).thenReturn(stats);

        ThirdPartyDataManagementTransactionsResponseDTO actual = service.findImportTransactions(appUser, paging);

        assertThat(actual).isEqualTo(responseDTO);

        verify(transactionRepository).findImportTransactionsByAccountId(Set.of(accountId), paging);
        verify(transactionRepository).countTransactionStatusesForAccounts(Set.of(accountId));

        verifyNoMoreInteractions(transactionRepository);
    }
}