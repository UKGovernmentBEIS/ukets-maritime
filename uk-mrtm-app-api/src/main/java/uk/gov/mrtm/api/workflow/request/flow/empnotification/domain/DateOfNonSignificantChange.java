package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{(#startDate == null) || (#endDate == null) || " +
        "T(java.time.LocalDate).parse(#startDate).isBefore(T(java.time.LocalDate).parse(#endDate))}",
        message = "empNotification.endDate.startDate")
public class DateOfNonSignificantChange {

    private LocalDate startDate;

    private LocalDate endDate;
}
