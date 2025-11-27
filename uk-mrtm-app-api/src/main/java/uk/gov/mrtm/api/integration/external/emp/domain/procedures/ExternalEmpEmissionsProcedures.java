package uk.gov.mrtm.api.integration.external.emp.domain.procedures;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalEmpEmissionsProcedures {

    @Schema(description = "Manage the completeness of the list of ships and emission sources procedure")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm emissionSourcesProcedure;

    @Schema(description = "Determination of emission factors procedure")
    @Valid
    @NotNull
    private ExternalEmpEmissionFactorsProcedure emissionFactorsProcedure;

    @Schema(description = "Emissions reduction claim procedure")
    @Valid
    @NotNull
    private ExternalEmpReductionClaimProcedure reductionClaimProcedure;
}
