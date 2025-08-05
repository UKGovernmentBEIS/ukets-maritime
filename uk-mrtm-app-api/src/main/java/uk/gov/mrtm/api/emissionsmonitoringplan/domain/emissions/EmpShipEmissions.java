package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.exemptionconditions.ExemptionConditions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.EmpFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.measurementdescription.MeasurementDescription;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueField;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpShipEmissions implements Comparable<EmpShipEmissions> {

    @Valid
    @NotNull
    @UniqueField
    private ShipDetails details;

    @NotNull
    private UUID uniqueIdentifier;

    @Builder.Default
    @Valid
    @NotEmpty
    @JsonDeserialize(as = LinkedHashSet.class)
    private Set<@NotNull EmpFuelsAndEmissionsFactors> fuelsAndEmissionsFactors = new HashSet<>();

    @Builder.Default
    @JsonDeserialize(as = LinkedHashSet.class)
    @NotEmpty
    @Valid
    private Set<@NotNull EmpEmissionsSources> emissionsSources = new HashSet<>();

    @Builder.Default
    @JsonDeserialize(as = LinkedHashSet.class)
    @NotEmpty
    @Valid
    private Set<@NotNull UncertaintyLevel> uncertaintyLevel = new HashSet<>();

    @Valid
    @NotNull
    private EmpCarbonCapture carbonCapture;

    @Builder.Default
    @JsonDeserialize(as = LinkedHashSet.class)
    @NotEmpty
    @Valid
    private Set<@NotNull MeasurementDescription> measurements = new HashSet<>();

    @Valid
    @NotNull
    private ExemptionConditions exemptionConditions;

    @Override
    public int compareTo(EmpShipEmissions o) {
        return this.details.getName().compareTo(o.details.getName());
    }
}
