package uk.gov.mrtm.api.integration.registry.accountupdated.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.account.domain.AccountUpdatedRegistryEvent;
import uk.gov.mrtm.api.integration.registry.accountupdated.domain.AccountUpdatedSubmittedEventDetails;

@RequiredArgsConstructor
@Component
@ConditionalOnProperty(name = "registry.integration.account.updated.enabled", havingValue = "true")
@Primary
public class MaritimeAccountUpdatedEventListener implements MaritimeAccountUpdatedEventListenerResolver {

    private final AccountUpdatedNotifyRegistryService notifyRegistryService;

    @Override
    public AccountUpdatedSubmittedEventDetails onAccountUpdatedEvent(AccountUpdatedRegistryEvent event) {
        return notifyRegistryService.notifyRegistry(event);
    }
}
