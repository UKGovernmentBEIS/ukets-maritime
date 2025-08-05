package uk.gov.mrtm.api.emissionsmonitoringplan.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmpProcedureForm {

    @NotBlank
    @Size(max = 250)
    private String reference;

    @Size(max = 250)
    private String version;

    @NotBlank
    @Size(max = 10000)
    private String description;

    @NotBlank
    @Size(max = 250)
    private String responsiblePersonOrPosition;

    @NotBlank
    @Size(max = 250)
    private String recordsLocation;

    @Size(max = 250)
    private String itSystemUsed;

}
