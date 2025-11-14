package uk.gov.mrtm.api.workflow.request.flow.doe.common.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#totalReportableEmissions?.compareTo(#lessVoyagesInNorthernIrelandDeduction) >= 0)}",
    message = "doe.emissions.ni.must.be.less.than.total")
@SpELExpression(expression = "{(#lessVoyagesInNorthernIrelandDeduction?.compareTo(#surrenderEmissions) >= 0)}",
    message = "doe.emissions.surrender.must.be.less.than.ni")
public class DoeTotalMaritimeEmissions {

    @NotNull
    private DoeDeterminationType determinationType;

    @NotNull
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal totalReportableEmissions;

    @NotNull
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal lessVoyagesInNorthernIrelandDeduction;

    @NotNull
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal surrenderEmissions;

    @NotBlank
    @Size(max=10000)
    private String calculationApproach;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<UUID> supportingDocuments = new HashSet<>();
}
