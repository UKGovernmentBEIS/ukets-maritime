package uk.gov.mrtm.api.integration.registry.accountcreated.request;

import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;

public interface MaritimeAccountCreatedEventListenerResolver {

    void onAccountCreatedEvent(EmpApprovedEvent event);
}
