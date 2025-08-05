package uk.gov.mrtm.api.reporting.domain.aggregateddata;

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
import uk.gov.netz.api.common.validation.uniqueelements.UniqueElements;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueField;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AerShipAggregatedDataSave {

    @NotNull
    private UUID uniqueIdentifier;

    private boolean isFromFetch;

    @NotBlank
    @Size(max = 7)
    @UniqueField
    private String imoNumber;

    @Builder.Default
    @Valid
    @JsonDeserialize(as = LinkedHashSet.class)
    private Set<@NotNull @Valid AerAggregatedDataFuelConsumption> fuelConsumptions = new HashSet<>();

    @Valid
    private AerAggregatedEmissionsMeasurementSave emissionsWithinUKPorts;

    @Valid
    private AerAggregatedEmissionsMeasurementSave emissionsBetweenUKPorts;

    @Valid
    private AerAggregatedEmissionsMeasurementSave emissionsBetweenUKAndEEAVoyages;

    @Valid
    private AerAggregatedEmissionsMeasurementSave smallIslandSurrenderReduction;
}
