package uk.gov.mrtm.api.integration.external.emp.domain.shipemissions;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalEmpMeasurementDescription {

    @NotBlank
    @Size(min = 1, max = 250)
    private String name;

    @Size(max = 10000)
    private String technicalDescription;

    @Schema(description = "Emission source names this device is used for")
    @Builder.Default
    @NotEmpty
    @JsonDeserialize(as = LinkedHashSet.class)
    private Set<String> emissionSourceName = new LinkedHashSet<>();
}
