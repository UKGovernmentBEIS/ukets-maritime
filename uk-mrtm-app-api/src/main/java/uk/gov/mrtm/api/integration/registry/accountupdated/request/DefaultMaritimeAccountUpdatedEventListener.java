package uk.gov.mrtm.api.integration.registry.accountupdated.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.account.domain.AccountUpdatedRegistryEvent;
import uk.gov.mrtm.api.integration.registry.accountupdated.domain.AccountUpdatedSubmittedEventDetails;

@RequiredArgsConstructor
@Component
@Log4j2
public class DefaultMaritimeAccountUpdatedEventListener implements MaritimeAccountUpdatedEventListenerResolver {

    @Override
    public AccountUpdatedSubmittedEventDetails onAccountUpdatedEvent(AccountUpdatedRegistryEvent event) {
        log.info("Account updated integration point is disabled, skipping messaging registry...");
        return AccountUpdatedSubmittedEventDetails.builder().notifiedRegistry(false).build();
    }
}
