package uk.gov.mrtm.api.integration.external.emp.domain.procedures;

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
public class ExternalEmpProcedureForm {

    @NotBlank
    @Size(min = 1, max = 250)
    private String referenceExistingProcedure;

    @Size(max = 250)
    private String versionExistingProcedure;

    @NotBlank
    @Size(min = 1, max = 10000)
    private String description;

    @NotBlank
    @Size(min = 1, max = 250)
    private String responsiblePerson;

    @NotBlank
    @Size(min = 1, max = 250)
    private String locationOfRecords;

    @Size(max = 250)
    private String itSystem;

}
