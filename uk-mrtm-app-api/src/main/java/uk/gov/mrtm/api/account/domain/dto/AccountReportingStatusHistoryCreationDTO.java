package uk.gov.mrtm.api.account.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountReportingStatusHistoryCreationDTO {

    @NotNull
    private MrtmAccountReportingStatus status;

    @NotBlank
    @Size(max = 10000)
    private String reason;
}
