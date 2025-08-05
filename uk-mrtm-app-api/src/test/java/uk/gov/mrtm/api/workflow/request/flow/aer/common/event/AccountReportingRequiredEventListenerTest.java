package uk.gov.mrtm.api.workflow.request.flow.aer.common.event;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.AccountReportingRequiredEvent;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerReportingObligationService;

import java.time.Year;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AccountReportingRequiredEventListenerTest {

    @InjectMocks
    private AccountReportingRequiredEventListener eventListener;

    @Mock
    private AerReportingObligationService aerReportingObligationService;


    @Test
    void onAccountReportingRequiredEvent() {
        Long accountId = 1L;
        Year year = Year.now();
        String userId = "userId";

        AccountReportingRequiredEvent event = AccountReportingRequiredEvent.builder()
            .accountId(accountId)
            .submitterId(userId)
            .year(year)
            .build();

        eventListener.onAccountReportingRequiredEvent(event);

        verify(aerReportingObligationService, times(1)).revertExemption(accountId, userId, year);
    }
}