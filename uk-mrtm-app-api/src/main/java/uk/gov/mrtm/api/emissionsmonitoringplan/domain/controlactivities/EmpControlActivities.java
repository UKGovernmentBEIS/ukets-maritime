package uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionMonitoringPlanSection;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpControlActivities implements EmissionMonitoringPlanSection {

    @Valid
    @NotNull
    private EmpProcedureForm qualityAssurance;

    @Valid
    @NotNull
    private EmpProcedureForm internalReviews;

    @Valid
    @NotNull
    private EmpProcedureForm corrections;

    @Valid
    @NotNull
    private EmpOutsourcedActivities outsourcedActivities;

    @Valid
    @NotNull
    private EmpProcedureForm documentation;

}
