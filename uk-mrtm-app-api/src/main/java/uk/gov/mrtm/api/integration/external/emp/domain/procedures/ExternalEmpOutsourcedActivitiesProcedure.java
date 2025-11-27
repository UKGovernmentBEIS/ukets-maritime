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
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#outsourcedActivitiesExists) == (#details != null)}",
    message = "emp.external.emission.procedures.outsourcedActivitiesExists")
public class ExternalEmpOutsourcedActivitiesProcedure {

    @Schema(description = "If true, the related procedure data are required, otherwise must be omitted")
    @NotNull
    private Boolean outsourcedActivitiesExists;

    @Valid
    private ExternalEmpProcedureForm details;
}
