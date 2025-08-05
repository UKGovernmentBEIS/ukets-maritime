package uk.gov.mrtm.api.emissionsmonitoringplan.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.service.MrtmApprovedAccountQueryService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmissionsMonitoringPlanIdentifierGeneratorTest {

    @InjectMocks
    private EmissionsMonitoringPlanIdentifierGenerator generator;

    @Mock
    private MrtmApprovedAccountQueryService approvedAccountQueryService;

    @Test
    void generate() {
        Long accountId = 1L;

        String expectedIdentifier = "UK-E-MA-00001";

        MrtmAccount account = MrtmAccount.builder()
                .id(accountId)
                .name("account name")
                .imoNumber("0000000")
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .status(MrtmAccountStatus.NEW)
                .build();

        when(approvedAccountQueryService.getApprovedAccountById(accountId)).thenReturn(Optional.of(account));

        assertEquals(expectedIdentifier, generator.generate(accountId));
        verify(approvedAccountQueryService).getApprovedAccountById(accountId);
        verifyNoMoreInteractions(approvedAccountQueryService);
    }

    @Test
    void generate_no_approved_account() {
        Long accountId = 1L;

        when(approvedAccountQueryService.getApprovedAccountById(accountId)).thenReturn(Optional.empty());

        BusinessException be = assertThrows(BusinessException.class, () -> generator.generate(accountId));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
    }
}
