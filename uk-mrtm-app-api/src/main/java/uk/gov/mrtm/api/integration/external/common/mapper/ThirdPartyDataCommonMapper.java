package uk.gov.mrtm.api.integration.external.common.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.integration.external.common.domain.BaseStagingEntity;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderStagingDetailsDTO;
import uk.gov.netz.api.common.config.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface ThirdPartyDataCommonMapper {

    @Mapping(target = "receivedOn", source = "updatedOn")
    ThirdPartyDataProviderStagingDetailsDTO map(BaseStagingEntity stagingEntity);
}
