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
public class ExternalEmpControlActivitiesProcedures {

    @Schema(description = "Quality assurance and reliability of information technology")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm qaItProcedure;

    @Schema(description = "Internal reviews and validation of data")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm dataReviewProcedure;

    @Schema(description = "Corrections and corrective actions")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm correctionsProcedure;

    @Schema(description = "Outsourced Activities")
    @Valid
    @NotNull
    private ExternalEmpOutsourcedActivitiesProcedure outsourcedActivitiesProcedure;

    @Valid
    @NotNull
    private ExternalEmpProcedureForm documentationProcedure;
}
