package uk.gov.mrtm.api.integration.external.aer.domain.shipemissions;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalAerDerogations {

    @Valid
    @NotNull
    private Boolean exceptionFromPerVoyageMonitoring;
}
