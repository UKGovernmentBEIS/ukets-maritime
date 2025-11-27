package uk.gov.mrtm.api.integration.external.emp.domain.delegatedresponsibility;

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
public class ExternalEmpRegisteredOwnerShipDetails {

    @NotBlank
    @Pattern(regexp = "^\\d{7}$")
    @UniqueField
    private String shipImoNumber;

    @NotBlank
    @Size(min = 1, max = 30)
    private String name;
}
