package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.exemptionconditions;

import jakarta.validation.constraints.Min;
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
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#exist) == (#minVoyages != null)}", message = "emp.emission.exemptionconditions.exist")
public class ExemptionConditions {

    @NotNull
    private Boolean exist;

    @Min(301)
    private Integer minVoyages;
}
