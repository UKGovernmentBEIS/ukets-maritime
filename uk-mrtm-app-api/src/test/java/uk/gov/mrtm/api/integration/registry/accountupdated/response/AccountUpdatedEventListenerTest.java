package uk.gov.mrtm.api.integration.registry.accountupdated.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.integration.model.account.AccountUpdatingEventOutcome;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AccountUpdatedEventListenerTest {

    private static final String TEST_CORRELATION_ID = "test-correlation-123";

    @InjectMocks
    private AccountUpdatedEventListener listener;

    @Mock
    private AccountUpdatedResponseHandler handler;

    @Test
    void handle() {
        AccountUpdatingEventOutcome event = mock(AccountUpdatingEventOutcome.class);
        listener.handle(event, TEST_CORRELATION_ID);
        verify(handler).handleResponse(event, TEST_CORRELATION_ID);
        verifyNoMoreInteractions(handler);
    }

}