package uk.gov.mrtm.api.integration.external.emp.domain.procedures;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#defaultFactorsUsed) == (#emissionFactorsProcedureDetails != null)}",
    message = "emp.external.emission.procedures.defaultFactorsUsed")
public class ExternalEmpEmissionFactorsProcedure {

    @Schema(description = "If false, the related procedure data are required, otherwise must be omitted")
    @NotNull
    private Boolean defaultFactorsUsed;

    @Valid
    private ExternalEmpProcedureForm emissionFactorsProcedureDetails;
}
