package uk.gov.mrtm.api.integration.registry.accountcontacts.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;

@RequiredArgsConstructor
@Component
@Log4j2
public class DefaultMaritimeAccountContactsEventListener implements MaritimeAccountContactsEventListenerResolver {

    @Override
    public void onAccountContactsEvent(AccountContactsRegistryEvent event) {
        log.info("Account contacts integration point is disabled, skipping messaging registry..." + event);
    }
}
