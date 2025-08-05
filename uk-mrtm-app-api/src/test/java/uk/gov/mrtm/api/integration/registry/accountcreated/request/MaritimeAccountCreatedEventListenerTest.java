package uk.gov.mrtm.api.integration.registry.accountcreated.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class MaritimeAccountCreatedEventListenerTest {

    @InjectMocks
    private MaritimeAccountCreatedEventListener listener;

    @Mock
    private AccountCreatedNotifyRegistryService accountCreatedNotifyRegistryService;

    @Test
    void onAccountCreatedEvent() {
        EmpApprovedEvent event = EmpApprovedEvent.builder()
                .accountId(1L)
                .build();

        listener.onAccountCreatedEvent(event);

        verify(accountCreatedNotifyRegistryService).notifyRegistry(event);
    }
}
