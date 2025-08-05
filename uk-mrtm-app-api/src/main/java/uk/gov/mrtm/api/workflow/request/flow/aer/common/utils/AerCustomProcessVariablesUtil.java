package uk.gov.mrtm.api.workflow.request.flow.aer.common.utils;

import lombok.experimental.UtilityClass;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.common.utils.DateUtils;

import java.time.LocalDate;
import java.time.Year;
import java.util.Map;

@UtilityClass
public class AerCustomProcessVariablesUtil {

    public static Map<String, Object> buildProcessVars(Year year) {
        return Map.of(
                MrtmBpmnProcessConstants.AER_EXPIRATION_DATE,
                DateUtils.atEndOfDay(LocalDate.of(year.plusYears(1).getValue(), 3, 31)));
    }
}
