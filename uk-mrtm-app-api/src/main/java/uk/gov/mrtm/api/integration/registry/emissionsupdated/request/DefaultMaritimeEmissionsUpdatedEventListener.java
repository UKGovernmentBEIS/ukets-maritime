package uk.gov.mrtm.api.integration.registry.emissionsupdated.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.common.ReportableEmissionsUpdatedEvent;

@RequiredArgsConstructor
@Component
@Log4j2
public class DefaultMaritimeEmissionsUpdatedEventListener implements MaritimeEmissionsUpdatedEventListenerResolver {

    @Override
    public ReportableEmissionsUpdatedSubmittedEventDetails onAccountCreatedEvent(ReportableEmissionsUpdatedEvent event) {
        log.info("Emissions updated integration point is disabled, skipping messaging registry..." + event);
        return ReportableEmissionsUpdatedSubmittedEventDetails.builder().notifiedRegistry(false).build();
    }
}
