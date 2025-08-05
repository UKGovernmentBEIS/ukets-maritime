package uk.gov.mrtm.api.reporting.domain.voyages;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumptionSave;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurementSave;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueElements;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AerVoyageSave {

    @NotNull
    private UUID uniqueIdentifier;

    @NotBlank
    @Size(max = 7)
    private String imoNumber;

    @NotNull
    @Valid
    private AerVoyageDetails voyageDetails;

    @Builder.Default
    @Valid
    @JsonDeserialize(as = LinkedHashSet.class)
    private Set<@NotNull @Valid AerFuelConsumptionSave> fuelConsumptions = new HashSet<>();

    @Valid
    private AerPortEmissionsMeasurementSave directEmissions;
}
