package uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#exist) == (#details != null)}", message = "emp.outsourced.activities.exist")
public class EmpOutsourcedActivities {

    @NotNull
    private Boolean exist;

    @Valid
    private EmpProcedureForm details;

}
