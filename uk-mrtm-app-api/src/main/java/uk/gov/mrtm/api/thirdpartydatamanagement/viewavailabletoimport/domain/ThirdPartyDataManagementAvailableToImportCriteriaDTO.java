package uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Sort;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.time.Year;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(
    expression = "#requestType == null or ((#requestType eq 'AER') ? #year != null : #year == null)",
    message = "third.party.data.management.request.type.year"
)
public class ThirdPartyDataManagementAvailableToImportCriteriaDTO {

    private ThirdPartyDataRequestType requestType;

    private Year year;

    @Builder.Default
    private ThirdPartyDataManagementAvailableToImportSortField sortBy =
        ThirdPartyDataManagementAvailableToImportSortField.RECEIVED_ON;

    @Builder.Default
    private Sort.Direction direction = Sort.Direction.DESC;
}
