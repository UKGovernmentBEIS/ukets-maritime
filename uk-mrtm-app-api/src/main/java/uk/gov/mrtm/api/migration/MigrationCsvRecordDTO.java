package uk.gov.mrtm.api.migration;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MigrationCsvRecordDTO {

    @NotEmpty (message = "{migrationCsvRecord.regulatingAuthority.empty}")
    @Size(max = 255, message = "{migrationCsvRecord.regulatingAuthority.maxSize}")
    @Email(message = "{migrationCsvRecord.regulatingAuthority.invalidFormat}")
    private String regulatingAuthority;

    @NotBlank(message = "{migrationCsvRecord.imoNumber.empty}")
    @Pattern(regexp = "^\\d{7}$", message = "{migrationCsvRecord.imoNumber.digitsOnly}")
    private String imoNumber;

    @NotBlank(message = "{migrationCsvRecord.operatorName.empty}")
    @Size(max = 255, message = "{migrationCsvRecord.operatorName.maxSize}")
    private String operatorName;

    @NotBlank(message = "{migrationCsvRecord.addressLine1.empty}")
    @Size(max = 255, message = "{migrationCsvRecord.addressLine1.maxSize}")
    private String addressLine1;

    @Size(max = 255, message = "{migrationCsvRecord.addressLine2.maxSize}")
    private String addressLine2;

    @NotBlank(message = "{migrationCsvRecord.city.empty}")
    @Size(max = 255, message = "{migrationCsvRecord.city.maxSize}")
    private String city;

    private String state;

    @NotBlank(message = "{migrationCsvRecord.postcode.empty}")
    @Size(max = 255, message = "{migrationCsvRecord.postcode.maxSize}")
    private String postcode;

    @NotBlank(message = "{migrationCsvRecord.country.empty}")
    @Size(max = 255, message = "{migrationCsvRecord.country.maxSize}")
    private String country;

    @NotBlank (message = "{migrationCsvRecord.firstMaritimeActivityDate.empty}")
    @Pattern(regexp = "^(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[012])/(202[6-9]|20[3-9][0-9])$", message = "{migrationCsvRecord.firstMaritimeActivityDate.invalidFormat}")
    private String dateOfFirstMaritimeActivity;

    @NotBlank(message = "{migrationCsvRecord.operatorFirstName.empty}")
    @Size(max = 255, message = "{migrationCsvRecord.operatorFirstName.maxSize}")
    private String operatorFirstName;

    @NotBlank(message = "{migrationCsvRecord.operatorLastName.empty}")
    @Size(max = 255, message = "{migrationCsvRecord.operatorLastName.maxSize}")
    private String operatorLastName;

    @NotBlank(message = "{migrationCsvRecord.operatorEmail.empty}")
    @Size(max = 255, message = "{migrationCsvRecord.operatorEmail.maxSize}")
    @Email(message = "{migrationCsvRecord.operatorEmail.invalidFormat}")
    private String operatorEmail;

}
