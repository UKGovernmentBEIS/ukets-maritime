package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.emp;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.integration.external.common.domain.StagingImportStatus;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.integration.external.emp.repository.StagingEmissionsMonitoringPlanRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ImportThirdPartyDataJobQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.authorization.core.service.AuthorityDefaultService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ThirdPartyDataManagementEmpVariationImportHandler extends ThirdPartyDataManagementBaseEmpImportHandler {

    private final RequestCustomRepository requestCustomRepository;
    private final DateService dateService;
    private final AuthorityDefaultService authorityDefaultService;

    public ThirdPartyDataManagementEmpVariationImportHandler(
        StagingEmissionsMonitoringPlanRepository repository,
        ImportThirdPartyDataJobQueryService jobQueryService,
        RequestCustomRepository requestCustomRepository,
        DateService dateService,
        AuthorityDefaultService authorityDefaultService) {

        super(repository, jobQueryService);
        this.requestCustomRepository = requestCustomRepository;
        this.dateService = dateService;
        this.authorityDefaultService = authorityDefaultService;
    }

    @Override
    public ThirdPartyDataManagementImportResult performImport(StagingEmissionsMonitoringPlanEntity stagingEntity, String userId) {

        if (StagingImportStatus.IMPORTED.equals(stagingEntity.getImportStatus())) {
            return ThirdPartyDataManagementImportResult.STAGING_DATA_ALREADY_IMPORTED;
        }

        if (!authorityDefaultService.existsByUserIdAndAccountId(userId, stagingEntity.getAccountId())) {
            return ThirdPartyDataManagementImportResult.USER_NOT_ASSIGNED_TO_ACCOUNT;
        }

        Optional<RequestTask> requestTaskOptional = requestCustomRepository.findByAccountAndRequestTaskType(
            List.of(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_SUBMIT),
            MrtmRequestType.EMP_VARIATION,
            ResourceType.ACCOUNT,
            stagingEntity.getAccountId().toString()
        );

        if (requestTaskOptional.isEmpty()) {
            return ThirdPartyDataManagementImportResult.REQUEST_TASK_NOT_FOUND;
        }

        RequestTask requestTask = requestTaskOptional.get();
        EmpVariationApplicationSubmitRequestTaskPayload taskPayload = (EmpVariationApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        StagingEmissionsMonitoringPlan stagingPayload = (StagingEmissionsMonitoringPlan) stagingEntity.getPayload();
        importDataToRequestTask(taskPayload.getEmissionsMonitoringPlan(), stagingPayload);

        Map<String, String> empSectionsCompleted = taskPayload.getEmpSectionsCompleted();
        Set<UUID> shipUuids = stagingPayload.getEmissions().getShips().stream()
            .map(EmpShipEmissions::getUniqueIdentifier)
            .collect(Collectors.toSet());
        markSectionsCompleted(empSectionsCompleted, shipUuids);

        stagingEntity.setImportStatus(StagingImportStatus.IMPORTED);
        stagingEntity.setImportedOn(dateService.getLocalDateTime());
        return ThirdPartyDataManagementImportResult.SUCCESS;
    }

    @Override
    public ThirdPartyDataRequestType getRequestType() {
        return ThirdPartyDataRequestType.EMP_VARIATION;
    }
}
