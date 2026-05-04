package uk.gov.mrtm.api.web.orchestrator.authorization.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;
import uk.gov.mrtm.api.integration.registry.accountcontacts.request.MaritimeAccountContactsEventListenerResolver;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.core.domain.Authority;
import uk.gov.netz.api.authorization.core.domain.AuthorityStatus;
import uk.gov.netz.api.authorization.core.repository.AuthorityRepository;
import uk.gov.netz.api.user.operator.domain.OperatorUserDTO;
import uk.gov.netz.api.user.operator.service.OperatorUserManagementService;

import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OperatorUserAuthorityUpdateOrchestratorTest {

    @InjectMocks
    private OperatorUserAuthorityUpdateOrchestrator service;

    @Mock
    private OperatorUserManagementService operatorUserManagementService;
    @Mock
    private MaritimeAccountContactsEventListenerResolver accountContactsEventListenerResolver;
    @Mock
    private AuthorityRepository authorityRepository;

    @Test
    void updateOperatorUserByAccountAndId() {
        String userId = "userId";
        long accountId1 = 1L;
        long accountId2 = 2L;
        OperatorUserDTO operatorUserDTO = mock(OperatorUserDTO.class);

        when(authorityRepository.findByUserIdAndStatus(userId, AuthorityStatus.ACTIVE)).thenReturn(
            List.of(Authority.builder().accountId(accountId1).build(), Authority.builder().accountId(accountId2).build()));
        service.updateOperatorUserByAccountAndId(accountId1, userId, operatorUserDTO);

        verify(operatorUserManagementService).updateOperatorUserByAccountAndId(accountId1, userId, operatorUserDTO);
        verify(accountContactsEventListenerResolver)
            .onAccountContactsEvent(AccountContactsRegistryEvent.builder().accountIds(Set.of(accountId1, accountId2)).build());
        verify(authorityRepository).findByUserIdAndStatus(userId, AuthorityStatus.ACTIVE);

        verifyNoMoreInteractions(operatorUserManagementService, accountContactsEventListenerResolver);
    }

    @Test
    void updateOperatorUser() {
        long accountId1 = 1L;
        long accountId2 = 2L;
        List<AppAuthority> authorities = List.of(AppAuthority.builder().accountId(accountId1).build(),
            AppAuthority.builder().accountId(accountId2).build());
        AppUser appUser = AppUser.builder().authorities(authorities).build();
        OperatorUserDTO operatorUserDTO = mock(OperatorUserDTO.class);

        service.updateOperatorUser(appUser, operatorUserDTO);

        verify(operatorUserManagementService).updateOperatorUser(appUser, operatorUserDTO);
        verify(accountContactsEventListenerResolver)
            .onAccountContactsEvent(AccountContactsRegistryEvent.builder().accountIds(Set.of(accountId1, accountId2)).build());

        verifyNoMoreInteractions(operatorUserManagementService, accountContactsEventListenerResolver);
        verifyNoInteractions(authorityRepository);
    }
}