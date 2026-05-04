package uk.gov.mrtm.api.integration.registry.accountexempt.request;

import uk.gov.mrtm.api.integration.registry.accountexempt.domain.AccountExemptEvent;

public interface MaritimeAccountExemptEventListenerResolver {

    void onAccountExemptEvent(AccountExemptEvent event);
}
