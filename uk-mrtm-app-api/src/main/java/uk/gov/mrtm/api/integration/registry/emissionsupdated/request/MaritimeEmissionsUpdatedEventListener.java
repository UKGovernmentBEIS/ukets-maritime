package uk.gov.mrtm.api.integration.registry.emissionsupdated.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.common.ReportableEmissionsUpdatedEvent;

@RequiredArgsConstructor
@Component
@ConditionalOnProperty(name = "registry.integration.emissions.updated.enabled", havingValue = "true")
@Primary
public class MaritimeEmissionsUpdatedEventListener implements MaritimeEmissionsUpdatedEventListenerResolver {

    private final ReportableEmissionsNotifyRegistryService notifyRegistryService;

    @Override
    public ReportableEmissionsUpdatedSubmittedEventDetails onAccountCreatedEvent(ReportableEmissionsUpdatedEvent event) {
        return notifyRegistryService.notifyRegistry(event);
    }
}
