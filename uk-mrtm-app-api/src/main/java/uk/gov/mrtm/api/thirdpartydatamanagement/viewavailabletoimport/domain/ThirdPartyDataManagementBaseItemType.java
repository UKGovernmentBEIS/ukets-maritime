package uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ThirdPartyDataManagementBaseItemType implements ThirdPartyDataManagementItemType {

    private ThirdPartyDataRequestType requestType;
}
