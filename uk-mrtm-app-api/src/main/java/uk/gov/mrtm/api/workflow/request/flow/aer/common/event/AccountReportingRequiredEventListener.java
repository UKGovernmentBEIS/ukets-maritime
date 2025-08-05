package uk.gov.mrtm.api.workflow.request.flow.aer.common.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.account.domain.AccountReportingRequiredEvent;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerReportingObligationService;

@Component
@RequiredArgsConstructor
public class AccountReportingRequiredEventListener {

    private final AerReportingObligationService aerReportingObligationService;

    @EventListener(AccountReportingRequiredEvent.class)
    public void onAccountReportingRequiredEvent(AccountReportingRequiredEvent event) {
        aerReportingObligationService.revertExemption(event.getAccountId(), event.getSubmitterId(), event.getYear());
    }
}
