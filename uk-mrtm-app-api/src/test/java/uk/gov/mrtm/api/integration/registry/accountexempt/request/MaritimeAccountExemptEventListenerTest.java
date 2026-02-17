package uk.gov.mrtm.api.integration.registry.accountexempt.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.accountexempt.domain.AccountExemptEvent;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class MaritimeAccountExemptEventListenerTest {

    @InjectMocks
    private MaritimeAccountExemptEventListener listener;

    @Mock
    private AccountExemptNotifyRegistryService notifyRegistryService;

    @Test
    void handleAccountExemptRegistryEvent() {
        AccountExemptEvent event = mock(AccountExemptEvent.class);

        listener.handleAccountExemptRegistryEvent(event);

        verify(notifyRegistryService).notifyRegistry(event);
        verifyNoMoreInteractions(notifyRegistryService);
    }
}