package uk.gov.mrtm.api.account.domain.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.account.validation.MinYear;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class MrtmAccountDTO {

    @NotBlank
    @Pattern(regexp = "^\\d{7}$", message = "{account.imonumber.typeMismatch}")
    private String imoNumber;

    @NotBlank(message = "{account.name.notEmpty}")
    @Size(max = 255, message = "{account.name.typeMismatch}")
    private String name;

    @NotNull
    @Valid
    @JsonUnwrapped
    private AddressStateDTO address;

    @NotNull
    @MinYear(message = "The year must be after or equal to 2026")
    private LocalDate firstMaritimeActivityDate;
}
