package uk.gov.mrtm.api.integration.registry.regulatornotice.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEventOutcome;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RegulatorNoticeEventListenerTest {

    private static final String TEST_CORRELATION_ID = "test-correlation-123";

    @InjectMocks
    private RegulatorNoticeEventListener listener;

    @Mock
    private RegulatorNoticeResponseHandler handler;

    @Test
    void handle() {
        RegulatorNoticeEventOutcome event = mock(RegulatorNoticeEventOutcome.class);
        listener.handle(event, TEST_CORRELATION_ID);
        verify(handler).handleResponse(event, TEST_CORRELATION_ID);
    }

}