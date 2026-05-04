package uk.gov.mrtm.api.integration.registry.accountexempt.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.registry.accountexempt.domain.AccountExemptEvent;

@RequiredArgsConstructor
@Component
@Log4j2
public class DefaultMaritimeAccountExemptEventListener implements MaritimeAccountExemptEventListenerResolver {

    @Override
    public void onAccountExemptEvent(AccountExemptEvent event) {
        log.info("Account exempt integration point is disabled, skipping messaging registry..." + event);
    }
}
