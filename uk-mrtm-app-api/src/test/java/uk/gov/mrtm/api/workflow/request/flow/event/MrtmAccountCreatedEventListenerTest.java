package uk.gov.mrtm.api.workflow.request.flow.event;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountCreatedEvent;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerCreationService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service.EmissionMonitoringPlanCreationService;

import java.lang.reflect.Field;
import java.time.Year;
import java.util.List;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class MrtmAccountCreatedEventListenerTest {

    @InjectMocks
    private MrtmAccountCreatedEventListener eventListener;

    @Mock
    private EmissionMonitoringPlanCreationService emissionMonitoringPlanCreationService;

    @Mock
    private AerCreationService aerCreationService;


    @Test
    void onMrtmAccountCreatedEvent() throws IllegalAccessException, NoSuchFieldException {
        Long accountId = 1L;

        List<Year> reportingYears = List.of(Year.of(2024), Year.of(2025));

        final MrtmAccountCreatedEvent createdEvent = MrtmAccountCreatedEvent.builder()
                .accountId(accountId)
                .reportingYears(reportingYears)
                .build();

        Field field = MrtmAccountCreatedEventListener.class.getDeclaredField("aerEnabled");
        field.setAccessible(true);
        field.set(eventListener, true);

        eventListener.onMrtmAccountCreatedEvent(createdEvent);

        verify(emissionMonitoringPlanCreationService).createRequestEmissionMonitoringPlan(accountId);
        verify(aerCreationService, Mockito.times(2))
                .createRequestAer(Mockito.eq(accountId), Mockito.any());
    }

}
