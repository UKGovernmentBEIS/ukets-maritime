package uk.gov.mrtm.api.web.orchestrator.authorization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;
import uk.gov.netz.api.account.service.AccountContactUpdateService;
import uk.gov.netz.api.authorization.operator.domain.AccountOperatorAuthorityUpdateDTO;
import uk.gov.netz.api.authorization.operator.domain.NewUserActivated;
import uk.gov.netz.api.authorization.operator.service.OperatorAuthorityUpdateService;
import uk.gov.netz.api.user.operator.service.OperatorUserNotificationGateway;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AccountOperatorUserAuthorityUpdateOrchestrator {

    private final OperatorAuthorityUpdateService operatorAuthorityUpdateService;
    private final OperatorUserNotificationGateway operatorUserNotificationGateway;
    private final AccountContactUpdateService accountContactUpdateService;
    private final ApplicationEventPublisher publisher;

    @Transactional
    public void updateAccountOperatorAuthorities(List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities,
                                                 Map<String, String> updatedContactTypes, Long accountId) {

        List<NewUserActivated> activatedOperators = operatorAuthorityUpdateService
                .updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId);

        accountContactUpdateService.updateAccountContacts(updatedContactTypes, accountId);

        if (!activatedOperators.isEmpty()) {
            operatorUserNotificationGateway.notifyUsersUpdateStatus(activatedOperators);
        }

        publisher.publishEvent(AccountContactsRegistryEvent.builder().accountIds(Set.of(accountId)).build());
    }
}
