package uk.gov.mrtm.api.integration.registry.accountexempt.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.registry.accountexempt.domain.AccountExemptEvent;

@RequiredArgsConstructor
@Component
@ConditionalOnProperty(name = "registry.integration.account.exempt.enabled", havingValue = "true")
public class MaritimeAccountExemptEventListener {

    private final AccountExemptNotifyRegistryService notifyRegistryService;

    @EventListener(AccountExemptEvent.class)
    @Transactional
    public void handleAccountExemptRegistryEvent(AccountExemptEvent event) {
        notifyRegistryService.notifyRegistry(event);
    }
}
