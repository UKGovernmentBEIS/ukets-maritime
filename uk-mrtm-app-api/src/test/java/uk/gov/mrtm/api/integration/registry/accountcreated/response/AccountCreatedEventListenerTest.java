package uk.gov.mrtm.api.integration.registry.accountcreated.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.account.AccountOpeningEventOutcome;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AccountCreatedEventListenerTest {

    private static final String TEST_CORRELATION_ID = "test-correlation-123";

    @InjectMocks
    private AccountCreatedEventListener listener;

    @Mock
    private AccountCreatedResponseHandler handler;

    @Test
    void handle() {
        AccountOpeningEventOutcome event = AccountOpeningEventOutcome.builder()
                .outcome(IntegrationEventOutcome.SUCCESS)
                .build();
        listener.handle(event, TEST_CORRELATION_ID);
        verify(handler).handleResponse(event, TEST_CORRELATION_ID);
    }

}
