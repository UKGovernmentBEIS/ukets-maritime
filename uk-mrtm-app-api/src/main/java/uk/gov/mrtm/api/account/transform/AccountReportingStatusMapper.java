package uk.gov.mrtm.api.account.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.account.domain.AccountReportingStatus;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusDTO;
import uk.gov.netz.api.common.config.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AccountReportingStatusMapper {

    @Mapping(target = "reason", ignore = true)
    AccountReportingStatusDTO toReportingStatusDTOIgnoreReason(AccountReportingStatus accountReportingStatus);

    AccountReportingStatusDTO toReportingStatusDTO(AccountReportingStatus accountReportingStatus);
}
