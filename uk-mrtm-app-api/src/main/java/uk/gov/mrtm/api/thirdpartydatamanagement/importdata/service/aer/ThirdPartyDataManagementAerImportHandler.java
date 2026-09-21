package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.aer;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAer;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAerEntity;
import uk.gov.mrtm.api.integration.external.aer.repository.StagingAerRepository;
import uk.gov.mrtm.api.integration.external.common.domain.StagingImportStatus;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.AerSectionsCompleted;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.AbstractThirdPartyDataImportHandler;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ImportThirdPartyDataJobQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.service.RequestAerApplyService;
import uk.gov.netz.api.authorization.core.service.AuthorityDefaultService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.SectionsCompletedStatuses.COMPLETED;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.SectionsCompletedStatuses.IN_PROGRESS;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.AER_APPLICATION_AMENDS_SUBMIT;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.AER_APPLICATION_SUBMIT;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
public class ThirdPartyDataManagementAerImportHandler extends AbstractThirdPartyDataImportHandler<StagingAerEntity> {

    private final StagingAerRepository repository;
    private final RequestCustomRepository requestCustomRepository;
    private final RequestAerApplyService requestAerApplyService;
    private final AuthorityDefaultService authorityDefaultService;

    public ThirdPartyDataManagementAerImportHandler(
        ImportThirdPartyDataJobQueryService jobQueryService,
        StagingAerRepository repository, RequestCustomRepository requestCustomRepository,
        RequestAerApplyService requestAerApplyService, AuthorityDefaultService authorityDefaultService) {

        super(jobQueryService);
        this.repository = repository;
        this.requestCustomRepository = requestCustomRepository;
        this.requestAerApplyService = requestAerApplyService;
        this.authorityDefaultService = authorityDefaultService;
    }

    @Override
    public StagingAerEntity findStagingEntityForUpdate(long stagingDataId) {
        return repository.findByIdForUpdate(stagingDataId)
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }

    @Override
    protected List<StagingAerEntity> findAllByStagingId(ThirdPartyDataManagementImportRequestDTO requestDTO) {
        return repository.findAllByIdInAndYear(requestDTO.getItems(), requestDTO.getYear());
    }

    @Override
    public ThirdPartyDataManagementImportResult performImport(StagingAerEntity stagingEntity, String userId) {

        if (StagingImportStatus.IMPORTED.equals(stagingEntity.getImportStatus())) {
            return ThirdPartyDataManagementImportResult.STAGING_DATA_ALREADY_IMPORTED;
        }

        if (!authorityDefaultService.existsByUserIdAndAccountId(userId, stagingEntity.getAccountId())) {
            return ThirdPartyDataManagementImportResult.USER_NOT_ASSIGNED_TO_ACCOUNT;
        }

        Optional<RequestTask> requestTaskOptional = requestCustomRepository.findByAccountRequestTaskTypeAndYear(
            List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT),
            MrtmRequestType.AER,
            ResourceType.ACCOUNT,
            stagingEntity.getAccountId().toString(),
            stagingEntity.getYear().getValue()
        );

        if (requestTaskOptional.isEmpty()) {
            return ThirdPartyDataManagementImportResult.REQUEST_TASK_NOT_FOUND;
        }

        RequestTask requestTask = requestTaskOptional.get();
        AerApplicationSubmitRequestTaskPayload taskPayload = (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        if (Boolean.FALSE.equals(taskPayload.getReportingRequired())) {
            return ThirdPartyDataManagementImportResult.REPORTING_NOT_REQUIRED;
        }

        if (taskPayload.getReportingRequired() == null) {
            taskPayload.setReportingRequired(true);
        }

        if (taskPayload.getAer() == null) {
            taskPayload.setAer(Aer.builder().build());
        }

        StagingAer stagingPayload = (StagingAer) stagingEntity.getPayload();
        Map<String, String> aerSectionsCompleted = calculateUpdatedSectionsCompleted(taskPayload.getAerSectionsCompleted(), stagingPayload);
        taskPayload.setAerSectionsCompleted(aerSectionsCompleted);

        requestAerApplyService.importAerFromStagingData(taskPayload, stagingEntity);

        return ThirdPartyDataManagementImportResult.SUCCESS;
    }

    @Override
    public void markInProgress(Set<Long> stagingIds) {
        repository.updateImportStatusByIdIn(stagingIds, true);
    }

    @Override
    public void markNotInProgress(Set<Long> stagingIds) {
        repository.updateImportStatusByIdIn(stagingIds, false);
    }

    @Override
    public ThirdPartyDataRequestType getRequestType() {
        return ThirdPartyDataRequestType.AER;
    }

    private Map<String, String> calculateUpdatedSectionsCompleted(Map<String, String> aerSectionsCompleted, StagingAer stagingPayload) {
        Set<UUID> shipUuids = stagingPayload.getEmissions().getShips().stream()
            .map(AerShipEmissions::getUniqueIdentifier)
            .collect(Collectors.toSet());
        Set<UUID> aggregatedDataShipUuids = stagingPayload.getAggregatedData().getEmissions().stream()
            .map(AerShipAggregatedData::getUniqueIdentifier)
            .collect(Collectors.toSet());

        aerSectionsCompleted.keySet().removeIf(key -> key.startsWith(AerSectionsCompleted.SHIP_EMISSIONS.getKey()));
        aerSectionsCompleted.keySet().removeIf(key -> key.startsWith(AerSectionsCompleted.SHIP_AGGREGATED_DATA.getKey()));

        aerSectionsCompleted.put(AerSectionsCompleted.EMISSIONS.getKey(), COMPLETED);
        shipUuids.forEach(uuid -> aerSectionsCompleted.put(AerSectionsCompleted.SHIP_EMISSIONS.getKey() + uuid, COMPLETED));
        aerSectionsCompleted.put(AerSectionsCompleted.AGGREGATED_DATA.getKey(), COMPLETED);
        aggregatedDataShipUuids.forEach(uuid -> aerSectionsCompleted.put(AerSectionsCompleted.SHIP_AGGREGATED_DATA.getKey() + uuid, COMPLETED));
        aerSectionsCompleted.put(AerSectionsCompleted.REPORTING_OBLIGATION.getKey(), COMPLETED);
        aerSectionsCompleted.put(AerSectionsCompleted.SMF.getKey(), IN_PROGRESS);

        return aerSectionsCompleted;
    }
}
