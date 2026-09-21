package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.emp;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.integration.external.emp.repository.StagingEmissionsMonitoringPlanRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.EmpSectionsCompleted;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.AbstractThirdPartyDataImportHandler;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ImportThirdPartyDataJobQueryService;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.SectionsCompletedStatuses.COMPLETED;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@Log4j2
public abstract class ThirdPartyDataManagementBaseEmpImportHandler
    extends AbstractThirdPartyDataImportHandler<StagingEmissionsMonitoringPlanEntity> {

    private final StagingEmissionsMonitoringPlanRepository repository;

    protected ThirdPartyDataManagementBaseEmpImportHandler(StagingEmissionsMonitoringPlanRepository repository,
                                                           ImportThirdPartyDataJobQueryService jobQueryService) {
        super(jobQueryService);
        this.repository = repository;
    }

    @Override
    public StagingEmissionsMonitoringPlanEntity findStagingEntityForUpdate(long stagingDataId) {
        return repository.findByIdForUpdate(stagingDataId)
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }

    @Override
    public List<StagingEmissionsMonitoringPlanEntity> findAllByStagingId(ThirdPartyDataManagementImportRequestDTO requestDTO) {
        return repository.findAllByIdIn(requestDTO.getItems());
    }

    @Override
    public void markInProgress(Set<Long> stagingIds) {
        repository.updateImportStatusByIdIn(stagingIds, true);
    }

    @Override
    public void markNotInProgress(Set<Long> stagingIds) {
        repository.updateImportStatusByIdIn(stagingIds, false);
    }

    public void importDataToRequestTask(EmissionsMonitoringPlan emissionsMonitoringPlan, StagingEmissionsMonitoringPlan stagingPayload) {
        emissionsMonitoringPlan.setEmissions(stagingPayload.getEmissions());
        emissionsMonitoringPlan.setMandate(stagingPayload.getMandate());
        emissionsMonitoringPlan.setSources(stagingPayload.getSources());
        emissionsMonitoringPlan.setGreenhouseGas(stagingPayload.getGreenhouseGas());
        emissionsMonitoringPlan.setManagementProcedures(stagingPayload.getManagementProcedures());
        emissionsMonitoringPlan.setControlActivities(stagingPayload.getControlActivities());
        emissionsMonitoringPlan.setDataGaps(stagingPayload.getDataGaps());
    }

    public void markSectionsCompleted(Map<String, String> empSectionsCompleted, Set<UUID> shipUuids) {
        empSectionsCompleted.keySet().removeIf(key -> key.startsWith(EmpSectionsCompleted.SHIP_EMISSIONS.getKey()));

        shipUuids.forEach(uuid -> empSectionsCompleted.put(EmpSectionsCompleted.SHIP_EMISSIONS.getKey() + uuid, COMPLETED));
        empSectionsCompleted.put(EmpSectionsCompleted.CONTROL_ACTIVITIES.getKey(), COMPLETED);
        empSectionsCompleted.put(EmpSectionsCompleted.DATA_GAPS.getKey(), COMPLETED);
        empSectionsCompleted.put(EmpSectionsCompleted.EMISSIONS.getKey(), COMPLETED);
        empSectionsCompleted.put(EmpSectionsCompleted.GREENHOUSE_GAS.getKey(), COMPLETED);
        empSectionsCompleted.put(EmpSectionsCompleted.MANAGEMENT_PROCEDURES.getKey(), COMPLETED);
        empSectionsCompleted.put(EmpSectionsCompleted.MANDATE.getKey(), COMPLETED);
        empSectionsCompleted.put(EmpSectionsCompleted.SOURCES.getKey(), COMPLETED);
    }
}
