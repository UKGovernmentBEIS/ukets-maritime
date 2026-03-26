package uk.gov.mrtm.api.integration.registry.regulatornotice.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeEvent;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.RegulatorNoticeSubmittedEventDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MaritimeRegulatorNoticeEventListenerTest {

    @InjectMocks
    private MaritimeRegulatorNoticeEventListener listener;

    @Mock
    private RegulatorNoticeNotifyRegistryService notifyRegistryService;

    @Test
    void onRegulatorNoticeEvent() {
        MrtmRegulatorNoticeEvent event = mock(MrtmRegulatorNoticeEvent.class);
        RegulatorNoticeSubmittedEventDetails expectedResponse = mock(RegulatorNoticeSubmittedEventDetails.class);

        when(notifyRegistryService.notifyRegistry(event)).thenReturn(expectedResponse);

        RegulatorNoticeSubmittedEventDetails actualResponse = listener.onRegulatorNoticeEvent(event);

        assertEquals(expectedResponse, actualResponse);
        verify(notifyRegistryService).notifyRegistry(event);

        verifyNoMoreInteractions(notifyRegistryService);

    }
}