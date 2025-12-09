package uk.gov.mrtm.api.integration.external.emp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderDTO;
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

    public ThirdPartyDataProviderDTO getThirdPartyDataProviderInfo(Long accountId, RequestTaskPayload requestTaskPayload) {
        Optional<StagingEmissionsMonitoringPlanEntity> stagingEmissionsMonitoringPlanEntity =
            stagingEmpRepository.findByAccountId(accountId);

        return stagingEmissionsMonitoringPlanEntity.map(emissionsMonitoringPlanEntity ->
                ThirdPartyDataProviderDTO.builder()
                    .importedOn(emissionsMonitoringPlanEntity.getImportedOn())
                    .receivedOn(emissionsMonitoringPlanEntity.getUpdatedOn())
                    .providerName(emissionsMonitoringPlanEntity.getProviderName())
                    .payload(emissionsMonitoringPlanEntity.getPayload())
                    .build())
            .orElse(null);
    }

    public List<String> getTypes() {
        return List.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT);
    }
}
