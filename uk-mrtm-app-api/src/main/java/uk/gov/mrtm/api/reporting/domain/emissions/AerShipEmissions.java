package uk.gov.mrtm.api.reporting.domain.emissions;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.DataInputType;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueField;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AerShipEmissions {

    @Valid
    @NotNull
    @UniqueField
    private AerShipDetails details;

    @NotNull
    private UUID uniqueIdentifier;

    @Builder.Default
    @Valid
    @NotEmpty
    @JsonDeserialize(as = LinkedHashSet.class)
    private Set<@NotNull AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors = new HashSet<>();

    @Builder.Default
    @JsonDeserialize(as = LinkedHashSet.class)
    @NotEmpty
    @Valid
    private Set<@NotNull EmissionsSources> emissionsSources = new HashSet<>();

    @Builder.Default
    @JsonDeserialize(as = LinkedHashSet.class)
    @NotEmpty
    @Valid
    private Set<@NotNull UncertaintyLevel> uncertaintyLevel = new HashSet<>();

    @Valid
    @NotNull
    private AerDerogations derogations;

    @NotNull
    private DataInputType dataInputType;
}
