package uk.gov.mrtm.api.web.orchestrator.authorization.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;
import uk.gov.mrtm.api.integration.registry.accountcontacts.request.MaritimeAccountContactsEventListenerResolver;
import uk.gov.netz.api.authorization.operator.service.OperatorAuthorityDeletionService;

import java.util.Set;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AccountOperatorUserAuthorityDeleteOrchestratorTest {

    @InjectMocks
    private AccountOperatorUserAuthorityDeleteOrchestrator service;

    @Mock
    private OperatorAuthorityDeletionService operatorAuthorityDeletionService;
    @Mock
    private MaritimeAccountContactsEventListenerResolver accountContactsEventListenerResolver;

    @Test
    void updateAccountOperatorAuthorities() {
        String userId = "userId";
        long accountId = 1L;

        service.deleteAccountOperatorAuthority(userId, accountId);

        verify(operatorAuthorityDeletionService).deleteAccountOperatorAuthority(userId, accountId);
        verify(accountContactsEventListenerResolver).onAccountContactsEvent(AccountContactsRegistryEvent.builder().accountIds(Set.of(accountId)).build());

        verifyNoMoreInteractions(operatorAuthorityDeletionService, accountContactsEventListenerResolver);
    }
}