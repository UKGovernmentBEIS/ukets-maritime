package uk.gov.mrtm.api.workflow.request.flow.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.account.domain.MrtmAccountUpdatedEvent;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerCreationService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerRequestQueryService;

import java.time.Year;
import java.util.HashSet;
import java.util.Set;

@Log4j2
@Component
@RequiredArgsConstructor
public class MrtmAccountUpdatedEventListener {

    private final AerCreationService aerCreationService;

    private final AerRequestQueryService aerRequestQueryService;

    @EventListener(MrtmAccountUpdatedEvent.class)
    public void onMrtmAccountUpdatedEvent(MrtmAccountUpdatedEvent event) {

        Set<Year> excludedYears = aerRequestQueryService.findAerRequestsReportingYearByAccountId(event.getAccountId());
        Set<Year> reportingYears = new HashSet<>(event.getReportingYears());
        reportingYears.removeAll(excludedYears);

        reportingYears.forEach(year -> aerCreationService.createRequestAer(event.getAccountId(), year));
    }
}
