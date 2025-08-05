package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{((#monitoringMethod eq 'DIRECT') && (#methodApproach eq 'SHIP_SPECIFIC')) || " +
        "((#monitoringMethod ne 'DIRECT'))}",
        message = "emp.emission.uncertaintyLevel.monitoringMethod")
@SpELExpression(expression = "{((#methodApproach eq 'DEFAULT') && (#value?.compareTo(new java.math.BigDecimal('7.5')) == 0)) ||" +
        "(#methodApproach eq 'SHIP_SPECIFIC')}",
        message = "emp.emission.uncertaintyLevel.methodApproach")
public class UncertaintyLevel {

    @NotNull
    private MonitoringMethod monitoringMethod;

    @NotNull
    private MethodApproach methodApproach;

    @NotNull
    @Positive
    @Digits(integer=3, fraction=2)
    @DecimalMax(value = "100")
    private BigDecimal value;
}
