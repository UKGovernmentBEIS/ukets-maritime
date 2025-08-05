package uk.gov.mrtm.api.account.transform;

import org.mapstruct.Mapper;
import uk.gov.mrtm.api.account.domain.AccountReportingStatusHistory;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryDTO;
import uk.gov.netz.api.common.config.MapperConfig;

import java.util.List;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AccountReportingStatusHistoryMapper {

    List<AccountReportingStatusHistoryDTO> toReportingStatusHistoryDTO(List<AccountReportingStatusHistory> reportingStatusHistory);
}
