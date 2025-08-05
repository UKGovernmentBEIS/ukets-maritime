package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(
        expression = "{#fuelDetails.?[ (#this.type eq 'LNG' || #this.type eq 'BIO_LNG' || #this.type eq 'E_LNG' || #this.type eq 'OTHER') ? " +
                "(#this.methaneSlip == null or #this.methaneSlipValueType == null) : " +
                "(#this.methaneSlip != null or #this.methaneSlipValueType != null)].empty}",
        message = "emp.invalid.fuel.details.methane.slip"
        )
public class EmissionsSources {

    @NotBlank
    @Size(max = 255)
    private String name;

    @NotNull
    private EmissionSourceType type;

    @NotNull
    private EmissionSourceClass sourceClass;

    @Builder.Default
    @JsonDeserialize(as = LinkedHashSet.class)
    @NotEmpty
    @Valid
    private Set<FuelOriginTypeName> fuelDetails = new HashSet<>();

    @Builder.Default
    @NotEmpty
    private Set<MonitoringMethod> monitoringMethod = new HashSet<>();

    @NotNull
    private UUID uniqueIdentifier;
}
