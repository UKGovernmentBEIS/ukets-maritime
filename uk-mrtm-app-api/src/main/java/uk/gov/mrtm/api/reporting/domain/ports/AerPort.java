package uk.gov.mrtm.api.reporting.domain.ports;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AerPort {
    @NotNull
    private UUID uniqueIdentifier;

    @NotBlank
    @Size(max = 7)
    private String imoNumber;

    @NotNull
    @Valid
    private AerPortDetails portDetails;

    @Builder.Default
    @Valid
    @JsonDeserialize(as = LinkedHashSet.class)
    private Set<@NotNull @Valid AerFuelConsumption> fuelConsumptions = new HashSet<>();

    @Valid
    private AerPortEmissionsMeasurement directEmissions;

    @NotNull
    @Valid
    private AerPortEmissionsMeasurement totalEmissions;

    @NotNull
    @Valid
    private AerPortEmissionsMeasurement surrenderEmissions;
}
