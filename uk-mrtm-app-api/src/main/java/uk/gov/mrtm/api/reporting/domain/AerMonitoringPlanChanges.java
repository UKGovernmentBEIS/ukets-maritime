package uk.gov.mrtm.api.reporting.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#changesExist) == (#changes != null)}", message = "aer.monitoringPlanChanges.changesExist")
public class AerMonitoringPlanChanges {

    @NotNull
    private Boolean changesExist;

    @Size(max = 10000)
    private String changes;
}
