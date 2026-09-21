package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.time.Year;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(
    expression = "#requestType == null or ((#requestType eq 'AER') ? #year != null : #year == null)",
    message = "third.party.data.management.request.type.year"
)
public class ThirdPartyDataManagementImportRequestDTO {

    @NotNull
    private ThirdPartyDataRequestType requestType;

    private Year year;

    @NotEmpty
    private Set<Long> items;
}
