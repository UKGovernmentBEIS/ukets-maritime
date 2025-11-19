package uk.gov.mrtm.api.workflow.request.flow.doe.common.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoeTotalMaritimeEmissions {

    @NotNull
    private DoeDeterminationType determinationType;

    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal totalReportableEmissions;

    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal smallIslandFerryDeduction;

    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal iceClassDeduction;

    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal surrenderEmissions;

    @NotBlank
    @Size(max=10000)
    private String calculationApproach;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<UUID> supportingDocuments = new HashSet<>();
}
