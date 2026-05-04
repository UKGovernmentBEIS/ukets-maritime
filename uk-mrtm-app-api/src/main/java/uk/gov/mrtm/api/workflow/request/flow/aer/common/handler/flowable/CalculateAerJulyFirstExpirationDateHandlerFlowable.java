package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.common.utils.DateUtils;

import java.time.LocalDate;
import java.util.Map;

import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.AER_JULY_FIRST_EXPIRATION_DATE;

@Service
@RequiredArgsConstructor
public class CalculateAerJulyFirstExpirationDateHandlerFlowable implements JavaDelegate {

    @Override
    public void execute(DelegateExecution execution) {
        Map<String, Object> expirationVars =
            Map.of(AER_JULY_FIRST_EXPIRATION_DATE, DateUtils.atEndOfDay(LocalDate.of(2026, 7, 1)));
        execution.setVariables(expirationVars);
    }
}
