package uk.gov.mrtm.api.reporting.domain.ports;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.enumeration.PortCountries;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AerPortVisit {
    @NotNull
    private PortCountries country;

    @NotNull
    private String port;
}
