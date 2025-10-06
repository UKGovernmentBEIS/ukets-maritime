package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestExpirationType;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestExpirationVarsBuilder;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CalculateAerExpirationRemindersHandler implements JavaDelegate {

    private final RequestExpirationVarsBuilder requestExpirationVarsBuilder;

    @Override
    public void execute(DelegateExecution execution) {
        final Date expirationDate = (Date) execution.getVariable(MrtmBpmnProcessConstants.AER_EXPIRATION_DATE);

        Map<String, Object> expirationVars = new HashMap<>();
        expirationVars.putAll(requestExpirationVarsBuilder.buildExpirationVars(MrtmRequestExpirationType.AER, expirationDate));
        expirationVars.put(MrtmRequestExpirationType.AER + MrtmRequestExpirationType.SUBMISSION_WINDOW_REMINDER_DATE, getSubmissionWindowExpirationDate(expirationDate));

        execution.setVariables(expirationVars);
    }

    private Date getSubmissionWindowExpirationDate(Date expirationDate) {
        return new Date(expirationDate.getYear(), Calendar.JANUARY, 1, 0, 0);
    }
}
