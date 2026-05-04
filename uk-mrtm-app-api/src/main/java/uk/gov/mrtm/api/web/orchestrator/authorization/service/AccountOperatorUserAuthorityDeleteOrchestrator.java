package uk.gov.mrtm.api.web.orchestrator.authorization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;
import uk.gov.mrtm.api.integration.registry.accountcontacts.request.MaritimeAccountContactsEventListenerResolver;
import uk.gov.netz.api.authorization.operator.service.OperatorAuthorityDeletionService;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AccountOperatorUserAuthorityDeleteOrchestrator {

    private final OperatorAuthorityDeletionService operatorAuthorityDeletionService;
    private final MaritimeAccountContactsEventListenerResolver accountContactsEventListenerResolver;

    @Transactional
    public void deleteAccountOperatorAuthority(String userId, Long accountId) {

        operatorAuthorityDeletionService.deleteAccountOperatorAuthority(userId, accountId);

        accountContactsEventListenerResolver.onAccountContactsEvent(AccountContactsRegistryEvent.builder().accountIds(Set.of(accountId)).build());
    }
}
