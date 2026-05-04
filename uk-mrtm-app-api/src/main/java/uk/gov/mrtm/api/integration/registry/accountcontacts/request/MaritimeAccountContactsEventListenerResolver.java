package uk.gov.mrtm.api.integration.registry.accountcontacts.request;

import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;

public interface MaritimeAccountContactsEventListenerResolver {

    void onAccountContactsEvent(AccountContactsRegistryEvent event);
}
