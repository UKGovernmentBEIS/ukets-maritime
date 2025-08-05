package uk.gov.mrtm.api.account.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class MrtmAccountViewDTO extends MrtmAccountDTO {
    private Long id;

    private MrtmAccountStatus status;

    private Long sopId;

    private Integer registryId;

    private AddressStateDTO registeredAddress;

    private String businessId;

    private CompetentAuthorityEnum competentAuthority;
}
