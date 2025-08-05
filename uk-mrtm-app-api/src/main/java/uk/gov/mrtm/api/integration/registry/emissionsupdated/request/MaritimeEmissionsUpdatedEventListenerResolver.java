package uk.gov.mrtm.api.integration.registry.emissionsupdated.request;

import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.common.ReportableEmissionsUpdatedEvent;

public interface MaritimeEmissionsUpdatedEventListenerResolver {

    ReportableEmissionsUpdatedSubmittedEventDetails onAccountCreatedEvent(ReportableEmissionsUpdatedEvent event);
}
