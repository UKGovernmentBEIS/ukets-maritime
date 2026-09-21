package uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.Year;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ThirdPartyDataManagementReportingItemType extends ThirdPartyDataManagementBaseItemType {

    private Year year;
}
