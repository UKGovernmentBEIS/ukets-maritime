package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FlagState;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.IceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ReportingResponsibilityNature;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ShipType;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueField;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ShipDetails {

    @NotBlank
    @Pattern(regexp = "^\\d{7}$")
    @UniqueField
    private String imoNumber;

    @NotBlank
    @Size(max = 30)
    private String name;

    @NotNull
    private ShipType type;

    @NotNull
    @Min(value = 5000)
    @Max(value = 999999999)
    private Integer grossTonnage;

    @NotNull
    private FlagState flagState;

    @NotNull
    private IceClass iceClass;

    @NotNull
    private ReportingResponsibilityNature natureOfReportingResponsibility;
}
