package uk.gov.mrtm.api.authorization.mrtmauth.rules.services.handlers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataJobRepository;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ImportThirdPartyDataTransactionAccessRuleHandlerTest {
    private static final Long ACCOUNT_ID = 1L;

    @InjectMocks
    private ImportThirdPartyDataTransactionAccessRuleHandler handler;

    @Mock
    private ImportThirdPartyDataJobRepository jobRepository;

    private final AppUser USER = AppUser.builder().roleType(RoleTypeConstants.OPERATOR).authorities(List.of(AppAuthority.builder().accountId(ACCOUNT_ID).build())).build();

    @Test
    void success() {
        String jobId = "1";

        AuthorizationRuleScopePermission authorizationRulePermissionScope1 =
            AuthorizationRuleScopePermission.builder()
                .build();

        when(jobRepository.existsByTransactionIdAndAccountIds(Long.parseLong(jobId), Set.of(ACCOUNT_ID))).thenReturn(true);

        handler.evaluateRules(Set.of(authorizationRulePermissionScope1), USER, jobId);

        verify(jobRepository).existsByTransactionIdAndAccountIds(Long.parseLong(jobId), Set.of(ACCOUNT_ID));
        verifyNoMoreInteractions(jobRepository);
    }


    @Test
    void forbidden() {
        String jobId = "1";

        AuthorizationRuleScopePermission authorizationRulePermissionScope1 =
            AuthorizationRuleScopePermission.builder()
                .build();

        when(jobRepository.existsByTransactionIdAndAccountIds(Long.parseLong(jobId), Set.of(ACCOUNT_ID))).thenReturn(false);

        BusinessException businessException = assertThrows(
            BusinessException.class, () -> handler.evaluateRules(Set.of(authorizationRulePermissionScope1), USER, jobId));
        assertThat(businessException.getErrorCode()).isEqualTo(ErrorCode.FORBIDDEN);

        verify(jobRepository).existsByTransactionIdAndAccountIds(Long.parseLong(jobId), Set.of(ACCOUNT_ID));
        verifyNoMoreInteractions(jobRepository);
    }
}