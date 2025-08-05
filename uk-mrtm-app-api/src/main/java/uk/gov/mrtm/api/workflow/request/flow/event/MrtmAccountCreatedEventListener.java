package uk.gov.mrtm.api.workflow.request.flow.event;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.account.domain.MrtmAccountCreatedEvent;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerCreationService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service.EmissionMonitoringPlanCreationService;

@Component
@RequiredArgsConstructor
public class MrtmAccountCreatedEventListener {

    private final EmissionMonitoringPlanCreationService emissionMonitoringPlanCreationService;
    private final AerCreationService aerCreationService;
    @Value("${feature-flag.aer.workflow.enabled}")
    private boolean aerEnabled;

    @EventListener(MrtmAccountCreatedEvent.class)
    public void onMrtmAccountCreatedEvent(MrtmAccountCreatedEvent event) {
        emissionMonitoringPlanCreationService.createRequestEmissionMonitoringPlan(event.getAccountId());

        if (aerEnabled) {
            event.getReportingYears().forEach(year -> aerCreationService.createRequestAer(event.getAccountId(), year));
        }
    }
}
