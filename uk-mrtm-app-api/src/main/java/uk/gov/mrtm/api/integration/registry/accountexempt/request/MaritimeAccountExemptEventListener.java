package uk.gov.mrtm.api.integration.registry.accountexempt.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.registry.accountexempt.domain.AccountExemptEvent;

@RequiredArgsConstructor
@Component
@ConditionalOnProperty(name = "registry.integration.account.exempt.enabled", havingValue = "true")
@Primary
public class MaritimeAccountExemptEventListener implements MaritimeAccountExemptEventListenerResolver {

    private final AccountExemptNotifyRegistryService notifyRegistryService;

    @Override
    public void onAccountExemptEvent(AccountExemptEvent event) {
        notifyRegistryService.notifyRegistry(event);
    }
}
