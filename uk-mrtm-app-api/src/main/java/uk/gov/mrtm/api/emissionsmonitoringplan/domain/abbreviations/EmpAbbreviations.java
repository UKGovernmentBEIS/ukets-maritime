package uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionMonitoringPlanSection;
import uk.gov.netz.api.common.validation.SpELExpression;

import jakarta.validation.Valid;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{#exist == (#abbreviationDefinitions?.size() gt 0)}", message = "emp.abbreviations.exist")
public class EmpAbbreviations implements EmissionMonitoringPlanSection {

    private boolean exist;

    @Valid
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<EmpAbbreviationDefinition> abbreviationDefinitions;
}
