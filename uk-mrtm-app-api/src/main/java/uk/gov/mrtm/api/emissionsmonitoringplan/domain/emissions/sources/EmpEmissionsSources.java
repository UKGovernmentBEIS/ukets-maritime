package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmpEmissionsSources extends EmissionsSources {

    @Size(max = 30)
    private String referenceNumber;
}
