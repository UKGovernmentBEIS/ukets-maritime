package uk.gov.mrtm.api.integration.registry.accountcontacts.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEventOutcome;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AccountContactsEventListenerTest {

    private static final String TEST_CORRELATION_ID = "test-correlation-123";

    @InjectMocks
    private AccountContactsEventListener listener;

    @Mock
    private AccountContactsResponseHandler handler;

    @Test
    void handle() {
        MetsContactsEventOutcome event = mock(MetsContactsEventOutcome.class);
        listener.handle(event, TEST_CORRELATION_ID);
        verify(handler).handleResponse(event, TEST_CORRELATION_ID);
    }

}
