package uk.gov.mrtm.api.integration.registry.accountupdated.request;

import uk.gov.mrtm.api.account.domain.AccountUpdatedRegistryEvent;
import uk.gov.mrtm.api.integration.registry.accountupdated.domain.AccountUpdatedSubmittedEventDetails;

public interface MaritimeAccountUpdatedEventListenerResolver {

    AccountUpdatedSubmittedEventDetails onAccountUpdatedEvent(AccountUpdatedRegistryEvent event);
}
