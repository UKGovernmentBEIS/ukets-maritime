package uk.gov.mrtm.api.integration.registry.emissionsupdated.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEventOutcome;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class EmissionsUpdatedEventListenerTest {

    private static final String TEST_CORRELATION_ID = "test-correlation-123";

    @InjectMocks
    private EmissionsUpdatedEventListener listener;

    @Mock
    private EmissionsUpdatedResponseHandler handler;

    @Test
    void handle() {
        AccountEmissionsUpdateEventOutcome event = mock(AccountEmissionsUpdateEventOutcome.class);
        listener.handle(event, TEST_CORRELATION_ID);
        verify(handler).handleResponse(event, TEST_CORRELATION_ID);
        verifyNoMoreInteractions(handler);
    }

}