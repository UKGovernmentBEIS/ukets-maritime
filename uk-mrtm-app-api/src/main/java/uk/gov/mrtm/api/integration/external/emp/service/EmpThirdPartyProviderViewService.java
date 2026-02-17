package uk.gov.mrtm.api.integration.external.emp.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderStagingDetailsDTO;
import uk.gov.mrtm.api.integration.external.common.mapper.ThirdPartyDataCommonMapper;
import uk.gov.mrtm.api.integration.external.common.service.ThirdPartyProviderService;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.integration.external.emp.repository.StagingEmissionsMonitoringPlanRepository;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class EmpThirdPartyProviderViewService implements ThirdPartyProviderService {

    private final StagingEmissionsMonitoringPlanRepository stagingEmpRepository;
    private final ThirdPartyDataCommonMapper thirdPartyDataCommonMapper = Mappers.getMapper(ThirdPartyDataCommonMapper.class);

    public ThirdPartyDataProviderStagingDetailsDTO getThirdPartyDataProviderInfo(Long accountId, RequestTaskPayload requestTaskPayload) {
        Optional<StagingEmissionsMonitoringPlanEntity> stagingEntity =
            stagingEmpRepository.findByAccountId(accountId);

        return stagingEntity.map(thirdPartyDataCommonMapper::map).orElse(null);
    }

    public List<String> getTypes() {
        return List.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT);
    }
}
