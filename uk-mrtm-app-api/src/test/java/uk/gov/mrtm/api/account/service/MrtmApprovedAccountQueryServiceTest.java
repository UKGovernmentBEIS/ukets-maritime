package uk.gov.mrtm.api.account.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MrtmApprovedAccountQueryServiceTest {

    @InjectMocks
    private MrtmApprovedAccountQueryService approvedAccountQueryService;

    @Mock
    private MrtmAccountRepository mrtmAccountRepository;

    @Test
    void getApprovedAccountById() {
        Long accountId = 1L;
        String accountName = "accountName";
        String imoNumber = "0000000";

        MrtmAccount account = MrtmAccount.builder()
                .id(accountId)
                .name(accountName)
                .imoNumber(imoNumber)
                .competentAuthority(CompetentAuthorityEnum.NORTHERN_IRELAND)
                .status(MrtmAccountStatus.NEW)
                .build();

        when(mrtmAccountRepository
                .findByIdAndStatusNotIn(accountId, List.of(MrtmAccountStatus.CLOSED)))
                .thenReturn(Optional.of(account));

        Optional<MrtmAccount> optionalResult = approvedAccountQueryService.getApprovedAccountById(accountId);

        assertThat(optionalResult).isNotEmpty();
        assertEquals(account, optionalResult.get());

        verify(mrtmAccountRepository, times(1))
                .findByIdAndStatusNotIn(accountId, List.of(MrtmAccountStatus.CLOSED));
    }

    @Test
    void getApprovedAccountById_returns_empty() {
        Long accountId = 1L;

        when(mrtmAccountRepository
                .findByIdAndStatusNotIn(accountId, List.of(MrtmAccountStatus.CLOSED)))
                .thenReturn(Optional.empty());

        assertThat(approvedAccountQueryService.getApprovedAccountById(accountId)).isEmpty();

        verify(mrtmAccountRepository).findByIdAndStatusNotIn(accountId, List.of(MrtmAccountStatus.CLOSED));
    }
}
