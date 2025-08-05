package uk.gov.mrtm.api.reporting.domain.aggregateddata;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueElements;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AerAggregatedData {

    @Builder.Default
    @Valid
    @JsonDeserialize(as = LinkedHashSet.class)
    @UniqueElements
    @NotEmpty
    private Set<@NotNull @Valid AerShipAggregatedData> emissions = new HashSet<>();
}
