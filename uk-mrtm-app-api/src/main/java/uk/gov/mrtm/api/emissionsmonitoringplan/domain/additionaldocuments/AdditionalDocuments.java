package uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionMonitoringPlanSection;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{#exist == (#documents?.size() gt 0)}", message = "emp.additional.documents.exist")
public class AdditionalDocuments implements EmissionMonitoringPlanSection {

    private boolean exist;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<UUID> documents;

}
