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
public class ExternalEmpFuelConsumptionProcedures {

    @Schema(description = "Determining fuel bunkered and fuel in tanks")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm fuelBunkeredAndInTanksProcedure;

    @Schema(description = "Bunkering cross-checks")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm bunkeringCrossChecksProcedure;

    @Schema(description = "Recording, retrieving, transmitting and storing information")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm informationManagementProcedure;

    @Schema(description = "Ensuring quality assurance of measuring equipment")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm equipmentQualityAssuranceProcedure;

    @Schema(description = "Recording and safeguarding completeness of voyages")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm voyagesCompletenessProcedure;
}
