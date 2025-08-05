package uk.gov.mrtm.api.account.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountEmpDTO;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountViewDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpDetailsDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MrtmAccountViewService {

    private final MrtmAccountQueryService mrtmAccountQueryService;
    private final EmissionsMonitoringPlanQueryService empQueryService;

    @Transactional(readOnly = true)
    public MrtmAccountEmpDTO getMaritimeAccount(Long accountId) {
        MrtmAccountViewDTO mrtmAccountViewDTO = mrtmAccountQueryService.getAccountDTOByIdAndUser(accountId);
        final Optional<EmpDetailsDTO> empDetailsDTO = empQueryService.getEmissionsMonitoringPlanDetailsDTOByAccountId(accountId);

        return MrtmAccountEmpDTO.builder()
                .account(mrtmAccountViewDTO)
                .emp(empDetailsDTO.orElse(null))
                .build();
    }
}
