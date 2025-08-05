package uk.gov.mrtm.api.account.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.MrtmEmissionTradingScheme;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountDTO;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountUpdateDTO;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountViewDTO;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

@Mapper(
        componentModel = "spring",
        uses = {AddressStateMapper.class},
        config = MapperConfig.class
)
public interface MrtmAccountMapper {

    @Mapping(target = "name", source = "accountCreationDTO.name")
    MrtmAccount toMrtmAccount(MrtmAccountDTO accountCreationDTO, Long id, MrtmAccountStatus status,
                              MrtmEmissionTradingScheme emissionTradingScheme, CompetentAuthorityEnum competentAuthority, String businessId);

    void updateMrtmAccount(@MappingTarget MrtmAccount mrtmAccount, MrtmAccountUpdateDTO mrtmAccountUpdateDTO);

    MrtmAccountViewDTO toMrtmAccountViewDTO(MrtmAccount mrtmAccount);
}
