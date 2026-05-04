package uk.gov.mrtm.api.integration.registry.accountcontacts.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;

@RequiredArgsConstructor
@Component
@ConditionalOnProperty(name = "registry.integration.account.contacts.enabled", havingValue = "true")
@Primary
public class MaritimeAccountContactsEventListener implements MaritimeAccountContactsEventListenerResolver {

    private final AccountContactsNotifyRegistryService registryService;

    @Override
    public void onAccountContactsEvent(AccountContactsRegistryEvent event) {
        registryService.notifyRegistry(event);
    }
}
