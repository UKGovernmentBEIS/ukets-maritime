package uk.gov.mrtm.api.integration.external.emp.domain.shipemissions;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.MethodApproach;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{((#monitoringMethodCode eq 'DIRECT') && (#levelOfUncertaintyTypeCode eq 'SHIP_SPECIFIC')) || " +
        "((#monitoringMethodCode ne 'DIRECT'))}",
        message = "emp.external.emission.uncertaintyLevel.monitoringMethodCode")
@SpELExpression(expression = "{((#levelOfUncertaintyTypeCode eq 'DEFAULT') && (#shipSpecificUncertainty?.compareTo(new java.math.BigDecimal('7.5')) == 0)) ||" +
        "(#levelOfUncertaintyTypeCode eq 'SHIP_SPECIFIC')}",
        message = "emp.external.emission.uncertaintyLevel.levelOfUncertaintyTypeCode")
public class ExternalEmpUncertaintyLevel {

    @NotNull
    private MonitoringMethod monitoringMethodCode;

    @NotNull
    private MethodApproach levelOfUncertaintyTypeCode;

    @Schema(description = "Specific value for the level of uncertainty. Decimal number between 0 and 100 (inclusive) with up to 3 integer digits and 2 fractional digits")
    @NotNull
    @Positive
    @Digits(integer=3, fraction=2)
    @DecimalMax(value = "100")
    private BigDecimal shipSpecificUncertainty;
}
