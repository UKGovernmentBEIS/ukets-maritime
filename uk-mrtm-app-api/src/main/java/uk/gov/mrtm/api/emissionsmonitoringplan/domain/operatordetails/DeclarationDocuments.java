package uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{#exist == (#documents?.size() gt 0)}",
    message = "emp.operator.details.declaration.documents.exist")
public class DeclarationDocuments {

    private boolean exist;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<UUID> documents;

    @JsonIgnore
    public Set<UUID> getAttachmentIds(){
        return documents;
    }
}
