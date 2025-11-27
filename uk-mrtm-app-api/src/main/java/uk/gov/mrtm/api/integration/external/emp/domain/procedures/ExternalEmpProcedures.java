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
public class ExternalEmpProcedures {

    @Schema(description = "Procedures related to emissions sources and emissions factors")
    @Valid
    @NotNull
    private ExternalEmpEmissionsProcedures emissionsProcedures;

    @Schema(description = "Procedures related to the monitoring of greenhouse gas emissions and fuel consumption")
    @Valid
    @NotNull
    private ExternalEmpFuelConsumptionProcedures fuelConsumptionProcedures;

    @Schema(description = "Management procedures")
    @Valid
    @NotNull
    private ExternalEmpManagementProcedures managementProcedures;

    @Schema(description = "Control Activities procedures")
    @Valid
    @NotNull
    private ExternalEmpControlActivitiesProcedures controlActivitiesProcedures;
}
