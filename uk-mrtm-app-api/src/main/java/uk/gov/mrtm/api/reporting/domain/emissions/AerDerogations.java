package uk.gov.mrtm.api.reporting.domain.emissions;

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
public class AerDerogations {

    @Valid
    @NotNull
    private Boolean exceptionFromPerVoyageMonitoring;

    @NotNull
    private Boolean carbonCaptureAndStorageReduction;

    @NotNull
    private Boolean smallIslandFerryOperatorReduction;
}
