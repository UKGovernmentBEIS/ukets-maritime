package uk.gov.mrtm.api.web.orchestrator.authorization.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;
import uk.gov.netz.api.account.domain.AccountContactType;
import uk.gov.netz.api.account.service.AccountContactUpdateService;
import uk.gov.netz.api.authorization.core.domain.AuthorityStatus;
import uk.gov.netz.api.authorization.operator.domain.AccountOperatorAuthorityUpdateDTO;
import uk.gov.netz.api.authorization.operator.domain.NewUserActivated;
import uk.gov.netz.api.authorization.operator.service.OperatorAuthorityUpdateService;
import uk.gov.netz.api.user.operator.service.OperatorUserNotificationGateway;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountOperatorUserAuthorityUpdateOrchestratorTest {

    @InjectMocks
    private AccountOperatorUserAuthorityUpdateOrchestrator service;

    @Mock
    private OperatorAuthorityUpdateService operatorAuthorityUpdateService;

    @Mock
    private OperatorUserNotificationGateway operatorUserNotificationGateway;

    @Mock
    private AccountContactUpdateService accountContactUpdateService;

    @Mock
    private ApplicationEventPublisher publisher;

    @Test
    void updateAccountOperatorAuthorities() {
        Long accountId = 1L;
        List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
                AccountOperatorAuthorityUpdateDTO.builder().userId("user").roleCode("newRole").authorityStatus(AuthorityStatus.ACTIVE).build()
        );

        Map<String, String> updatedContactTypes = Map.of(AccountContactType.SECONDARY, "user");
        List<NewUserActivated> activatedOperators = List.of(NewUserActivated.builder().userId("user").build());

        when(operatorAuthorityUpdateService.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId))
                .thenReturn(activatedOperators);

        service.updateAccountOperatorAuthorities(accountOperatorAuthorities, updatedContactTypes, accountId);

        verify(operatorAuthorityUpdateService, times(1))
                .updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId);
        verify(accountContactUpdateService, times(1)).updateAccountContacts(updatedContactTypes, accountId);
        verify(publisher, times(1)).publishEvent(AccountContactsRegistryEvent.builder().accountIds(Set.of(accountId)).build());
        verify(operatorUserNotificationGateway, times(1)).notifyUsersUpdateStatus(activatedOperators);

        verifyNoMoreInteractions(operatorAuthorityUpdateService, accountContactUpdateService,
            publisher, operatorUserNotificationGateway);
    }

    @Test
    void updateAccountOperatorAuthorities_empty_notifications() {
        Long accountId = 1L;
        List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
                AccountOperatorAuthorityUpdateDTO.builder().userId("user").roleCode("newRole").authorityStatus(AuthorityStatus.ACTIVE).build()
        );
        Map<String, String> updatedContactTypes = Map.of(AccountContactType.SECONDARY, "user");

        when(operatorAuthorityUpdateService.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId))
                .thenReturn(List.of());

        service.updateAccountOperatorAuthorities(accountOperatorAuthorities, updatedContactTypes, accountId);

        verify(operatorAuthorityUpdateService, times(1))
                .updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId);
        verify(accountContactUpdateService, times(1)).updateAccountContacts(updatedContactTypes, accountId);
        verify(publisher, times(1)).publishEvent(AccountContactsRegistryEvent.builder().accountIds(Set.of(accountId)).build());
        verify(operatorUserNotificationGateway, never()).notifyUsersUpdateStatus(anyList());

        verifyNoMoreInteractions(operatorAuthorityUpdateService, accountContactUpdateService, publisher);
        verifyNoInteractions(operatorUserNotificationGateway);
    }
}
