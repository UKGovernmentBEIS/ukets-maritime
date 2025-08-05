package uk.gov.mrtm.api.workflow.request.flow.aer.common.event;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.AccountReportingExemptEvent;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerReportingObligationService;

import java.time.Year;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AccountReportingExemptEventListenerTest {

    @InjectMocks
    private AccountReportingExemptEventListener eventListener;

    @Mock
    private AerReportingObligationService aerReportingObligationService;

    @Test
    void onAccountReportingExemptedEvent() {
        Long accountId = 1L;
        Year year = Year.now();
        String userId = "userId";

        AccountReportingExemptEvent event = AccountReportingExemptEvent.builder()
            .accountId(accountId)
            .submitterId(userId)
            .year(year)
            .build();

        eventListener.onAccountReportingExemptEvent(event);

        verify(aerReportingObligationService, times(1)).markAsExempt(accountId, userId, year);
    }
}