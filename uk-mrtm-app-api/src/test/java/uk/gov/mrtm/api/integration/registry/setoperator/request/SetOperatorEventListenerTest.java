package uk.gov.mrtm.api.integration.registry.setoperator.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.integration.model.operator.OperatorUpdateEvent;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class SetOperatorEventListenerTest {

    private static final String TEST_CORRELATION_ID = "test-correlation-123";

    @InjectMocks
    private SetOperatorEventListener listener;

    @Mock
    private SetOperatorResponseHandler handler;

    @Test
    void handle() {
        OperatorUpdateEvent event = mock(OperatorUpdateEvent.class);
        listener.handle(event, TEST_CORRELATION_ID);
        verify(handler).handleResponse(event, TEST_CORRELATION_ID);
        verifyNoMoreInteractions(handler);
    }

}
