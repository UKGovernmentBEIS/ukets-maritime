package uk.gov.mrtm.api.workflow.request.flow.aer.common.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.account.domain.AccountReportingExemptEvent;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerReportingObligationService;

@Component
@RequiredArgsConstructor
public class AccountReportingExemptEventListener {

    private final AerReportingObligationService aerReportingObligationService;

    @EventListener(AccountReportingExemptEvent.class)
    public void onAccountReportingExemptEvent(AccountReportingExemptEvent event) {
        aerReportingObligationService.markAsExempt(event.getAccountId(), event.getSubmitterId(), event.getYear());
    }
}
