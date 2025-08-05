package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import org.springframework.stereotype.Service;
import uk.gov.netz.api.common.utils.DateUtils;

import java.time.LocalDate;
import java.time.Year;
import java.util.Date;

@Service
public class VirDueDateService {

    public Date generateDueDate(Year year) {
        // For all VIRs the deadline is set at 30/06 of AER's year
        return DateUtils.atEndOfDay(LocalDate.of(year.plusYears(1).getValue(), 6, 30));
    }
}
