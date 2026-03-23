package uk.gov.mrtm.api.integration.registry.emissionsupdated.request;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.common.ReportableEmissionsUpdatedEvent;

@RequiredArgsConstructor
@Component
public class DefaultMaritimeEmissionsUpdatedEventListener implements MaritimeEmissionsUpdatedEventListenerResolver {

    @Override
    public ReportableEmissionsUpdatedSubmittedEventDetails onAccountCreatedEvent(ReportableEmissionsUpdatedEvent event) {
        return ReportableEmissionsUpdatedSubmittedEventDetails.builder().notifiedRegistry(false).build();
    }
}
