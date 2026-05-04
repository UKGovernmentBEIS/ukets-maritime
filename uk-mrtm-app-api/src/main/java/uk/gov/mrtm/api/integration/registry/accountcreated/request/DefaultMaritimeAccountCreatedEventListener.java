package uk.gov.mrtm.api.integration.registry.accountcreated.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;

@RequiredArgsConstructor
@Component
@Log4j2
public class DefaultMaritimeAccountCreatedEventListener implements MaritimeAccountCreatedEventListenerResolver {

    @Override
    public void onAccountCreatedEvent(EmpApprovedEvent event) {
        log.info("Account created integration point is disabled, skipping messaging registry..." + event);
    }
}
