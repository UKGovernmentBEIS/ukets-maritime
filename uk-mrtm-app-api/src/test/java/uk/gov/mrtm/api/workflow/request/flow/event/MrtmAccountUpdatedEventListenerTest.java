package uk.gov.mrtm.api.workflow.request.flow.event;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountUpdatedEvent;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerCreationService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerRequestQueryService;

import java.time.Year;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MrtmAccountUpdatedEventListenerTest {

    @InjectMocks
    private MrtmAccountUpdatedEventListener eventListener;

    @Mock
    private AerCreationService aerCreationService;
    @Mock
    private AerRequestQueryService aerRequestQueryService;

    @Test
    void onMrtmAccountUpdatedEvent() {
        Long accountId = 1L;
        final MrtmAccountUpdatedEvent updatedEvent = MrtmAccountUpdatedEvent.builder()
                .accountId(accountId)
                .reportingYears(List.of(Year.of(2025), Year.of(2024), Year.of(2023), Year.of(2022)))
                .build();

        when(aerRequestQueryService.findAerRequestsReportingYearByAccountId(accountId))
                .thenReturn(Set.of(Year.of(2023), Year.of(2022)));

        eventListener.onMrtmAccountUpdatedEvent(updatedEvent);

        verify(aerCreationService).createRequestAer(accountId, Year.of(2025));
        verify(aerCreationService).createRequestAer(accountId, Year.of(2024));
        verifyNoMoreInteractions(aerCreationService);
    }

    @Test
    void onMrtmAccountCreatedEvent_no_existing_AER() {
        Long accountId = 1L;
        final MrtmAccountUpdatedEvent updatedEvent = MrtmAccountUpdatedEvent.builder()
                .accountId(accountId)
                .reportingYears(List.of(Year.of(2025), Year.of(2024), Year.of(2023)))
                .build();

        when(aerRequestQueryService.findAerRequestsReportingYearByAccountId(accountId))
                .thenReturn(Collections.emptySet());

        eventListener.onMrtmAccountUpdatedEvent(updatedEvent);

        verify(aerCreationService).createRequestAer(accountId, Year.of(2025));
        verify(aerCreationService).createRequestAer(accountId, Year.of(2024));
        verify(aerCreationService).createRequestAer(accountId, Year.of(2023));
        verifyNoMoreInteractions(aerCreationService);
    }
}
