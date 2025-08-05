package uk.gov.mrtm.api.integration.registry.accountcreated.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;

@RequiredArgsConstructor
@Component
@ConditionalOnProperty(name = "registry.integration.account.created.enabled", havingValue = "true")
public class MaritimeAccountCreatedEventListener {

    private final AccountCreatedNotifyRegistryService accountCreatedNotifyRegistryService;

    @EventListener(EmpApprovedEvent.class)
    public void onAccountCreatedEvent(EmpApprovedEvent event) {
        accountCreatedNotifyRegistryService.notifyRegistry(event);
    }
}
