package uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionMonitoringPlanSection;
import uk.gov.netz.api.common.validation.SpELExpression;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueElements;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;


@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#exist) == (#registeredOwners?.size() gt 0)}", message = "emp.mandate.exist")
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#exist) ? " +
        "T(java.lang.Boolean).TRUE.equals(#responsibilityDeclaration) : #responsibilityDeclaration eq null}", message = "emp.mandate.responsibilityDeclaration")
public class EmpMandate implements EmissionMonitoringPlanSection {

    @NotNull
    private Boolean exist;

    @Builder.Default
    @JsonDeserialize(as = LinkedHashSet.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @UniqueElements
    Set<@NotNull @Valid EmpRegisteredOwner> registeredOwners = new HashSet<>();

    private Boolean responsibilityDeclaration;

}
