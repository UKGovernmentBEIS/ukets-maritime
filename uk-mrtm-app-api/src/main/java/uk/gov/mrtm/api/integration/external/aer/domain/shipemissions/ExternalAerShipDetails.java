package uk.gov.mrtm.api.integration.external.aer.domain.shipemissions;

import io.swagger.v3.oas.annotations.media.Schema;
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
import uk.gov.netz.api.common.validation.SpELExpression;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueField;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{(#allYear && #from == null && #to == null) " +
    "|| (!#allYear && #from != null && #to != null && T(java.time.LocalDate).parse(#from).isBefore(T(java.time.LocalDate).parse(#to)))}",
    message = "aer.external.ship.details.all.year.exist")
public class ExternalAerShipDetails {

    @NotBlank
    @Pattern(regexp = "^\\d{7}$")
    @UniqueField
    private String shipImoNumber;

    @Schema(description = "Name of the Ship as stated on IMO GISIS")
    @NotBlank
    @Size(min = 1, max = 255)
    private String name;

    @NotNull
    private ShipType shipType;

    @NotNull
    @Min(value = 5000)
    @Max(value = 999999999)
    private Integer grossTonnage;

    @Schema(description = "Code of the flag")
    @NotNull
    private FlagState flag;

    @Schema(description = "Ice class polar code")
    @NotNull
    private IceClass iceClassPolarCode;

    @Schema(description = "Nature of the company for the ship referenced in this EMP")
    @NotNull
    private ReportingResponsibilityNature companyNature;

    @Schema(description = "Indicates if the reporting period of the ship covers the entire year")
    @NotNull
    private Boolean allYear;

    @Schema(description = "Start date of the period. Required only when 'allYear' is false, otherwise must be omitted")
    private LocalDate from;

    @Schema(description = "End date of the period. Required only when 'allYear' is false, otherwise must be omitted")
    private LocalDate to;
}
