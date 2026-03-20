package uk.gov.mrtm.api.integration.registry.accountcontacts.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;

@RequiredArgsConstructor
@Component
@ConditionalOnProperty(name = "registry.integration.account.contacts.enabled", havingValue = "true")
public class MaritimeAccountContactsEventListener {

    private final AccountContactsNotifyRegistryService registryService;

    @EventListener(AccountContactsRegistryEvent.class)
    @Transactional
    public void handleAccountContactsRegistryEvent(AccountContactsRegistryEvent event) {
        registryService.notifyRegistry(event);
    }

}
