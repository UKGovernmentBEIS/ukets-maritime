package uk.gov.mrtm.api.integration.registry.accountexempt.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.integration.model.exemption.AccountExemptionUpdateEventOutcome;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AccountExemptEventListenerTest {

    @InjectMocks
    private AccountExemptEventListener listener;

    @Mock
    private AccountExemptResponseHandler handler;

    @Test
    void handleAccountContactRegistryEvent() {
        AccountExemptionUpdateEventOutcome event = mock(AccountExemptionUpdateEventOutcome.class);
        String correlationId = "correlationId";

        listener.handle(event, correlationId);

        verify(handler).handleResponse(event, correlationId);
        verifyNoMoreInteractions(handler);
    }
}