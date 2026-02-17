package uk.gov.mrtm.api.integration.registry.accountcontacts.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class MaritimeAccountContactsEventListenerTest {

    @InjectMocks
    private MaritimeAccountContactsEventListener listener;

    @Mock
    private AccountContactsNotifyRegistryService accountContactsNotifyRegistryService;

    @Test
    void handleAccountContactsRegistryEvent() {
        AccountContactsRegistryEvent event = mock(AccountContactsRegistryEvent.class);
        listener.handleAccountContactsRegistryEvent(event);

        verify(accountContactsNotifyRegistryService).notifyRegistry(event);
    }
}
