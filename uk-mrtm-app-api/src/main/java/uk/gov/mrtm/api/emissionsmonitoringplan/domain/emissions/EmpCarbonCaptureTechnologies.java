package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpCarbonCaptureTechnologies {

    @NotBlank
    @Size(max = 10000)
    private String description;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Set<UUID> files = new HashSet<>();

    @NotEmpty
    @Builder.Default
    @JsonDeserialize(as = LinkedHashSet.class)
    private Set<String> technologyEmissionSources = new HashSet<>();
}
