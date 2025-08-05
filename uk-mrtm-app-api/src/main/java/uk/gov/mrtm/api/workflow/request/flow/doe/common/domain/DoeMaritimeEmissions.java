package uk.gov.mrtm.api.workflow.request.flow.doe.common.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#chargeOperator) == (#feeDetails != null)}", message = "doe.fee.chargeOperator.feeDetails")
public class DoeMaritimeEmissions {

    @Valid
    @NotNull
    private DoeDeterminationReason determinationReason;

    @Valid
    @NotNull
    private DoeTotalMaritimeEmissions totalMaritimeEmissions;

    @NotNull
    private Boolean chargeOperator;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Valid
    private DoeFeeDetails feeDetails;

    @JsonIgnore
    public BigDecimal getFeeAmount() {
        return chargeOperator ? feeDetails.getTotalBillableHours().multiply(feeDetails.getHourlyRate()).setScale(2,
                RoundingMode.HALF_UP) : BigDecimal.ZERO;
    }
}
