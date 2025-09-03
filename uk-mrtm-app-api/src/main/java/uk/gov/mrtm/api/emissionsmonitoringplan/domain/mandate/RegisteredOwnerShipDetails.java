package uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueField;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredOwnerShipDetails {

    @NotBlank
    @Pattern(regexp = "^\\d{7}$")
    @UniqueField
    private String imoNumber;

    @NotBlank
    @Size(max = 30)
    private String name;
}
