package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.api.common.utils.DateUtils;

import java.time.LocalDate;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class CalculateAerJulyFirstExpirationDateHandlerFlowableTest {

    @InjectMocks
    private CalculateAerJulyFirstExpirationDateHandlerFlowable handler;

    @Test
    void execute() {
        DelegateExecution execution = mock(DelegateExecution.class);

        handler.execute(execution);

        verify(execution).setVariables(Map.of("aerJulyFirstExpirationDate", DateUtils.atEndOfDay(LocalDate.of(2026, 7, 1))));
        verifyNoMoreInteractions(execution);
    }

}