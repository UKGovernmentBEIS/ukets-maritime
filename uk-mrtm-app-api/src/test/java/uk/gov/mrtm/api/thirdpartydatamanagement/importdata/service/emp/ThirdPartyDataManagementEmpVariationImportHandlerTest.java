package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.emp;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities.EmpControlActivities;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.datagaps.EmpDataGaps;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCapture;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.ShipDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.exemptionconditions.ExemptionConditions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.EmpFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.measurementdescription.MeasurementDescription;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpManagementProcedures;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate.EmpMandate;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.monitoringreenhousegas.EmpMonitoringGreenhouseGas;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.integration.external.common.domain.StagingImportStatus;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.integration.external.emp.repository.StagingEmissionsMonitoringPlanRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ImportThirdPartyDataJobQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.authorization.core.service.AuthorityDefaultService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.EmpSectionsCompleted.CONTROL_ACTIVITIES;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.EmpSectionsCompleted.DATA_GAPS;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.EmpSectionsCompleted.EMISSIONS;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.EmpSectionsCompleted.GREENHOUSE_GAS;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.EmpSectionsCompleted.MANAGEMENT_PROCEDURES;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.EmpSectionsCompleted.MANDATE;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.EmpSectionsCompleted.SHIP_EMISSIONS;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.EmpSectionsCompleted.SOURCES;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataManagementEmpVariationImportHandlerTest {

    private static final Long ACCOUNT_ID = 1L;

    @InjectMocks
    private ThirdPartyDataManagementEmpVariationImportHandler handler;

    @Mock
    private RequestCustomRepository requestCustomRepository;
    @Mock
    private DateService dateService;
    @Mock
    private AuthorityDefaultService authorityDefaultService;
    @Mock
    private ImportThirdPartyDataJobQueryService jobQueryService;
    @Mock
    private StagingEmissionsMonitoringPlanRepository repository;

    @Test
    void getRequestType() {
        assertThat(handler.getRequestType()).isEqualTo(ThirdPartyDataRequestType.EMP_VARIATION);
    }

    @Test
    void markInProgress() {
        Set<Long> stagingIds = Set.of(1L);
        handler.markInProgress(stagingIds);

        verify(repository).updateImportStatusByIdIn(stagingIds, true);
        verifyNoInteractions(requestCustomRepository, authorityDefaultService, jobQueryService);
    }

    @Test
    void markNotInProgress() {
        Set<Long> stagingIds = Set.of(1L);
        handler.markNotInProgress(stagingIds);

        verify(repository).updateImportStatusByIdIn(stagingIds, false);
        verifyNoInteractions(requestCustomRepository, authorityDefaultService, jobQueryService);
    }

    @Test
    void findStagingEntityForUpdate() {
        Long stagingId = 1L;
        StagingEmissionsMonitoringPlanEntity stagingAerEntity = StagingEmissionsMonitoringPlanEntity.builder().id(stagingId).build();
        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingAerEntity));
        StagingEmissionsMonitoringPlanEntity actual = handler.findStagingEntityForUpdate(stagingId);

        assertThat(actual).isEqualTo(stagingAerEntity);

        verify(repository).findByIdForUpdate(stagingId);
        verifyNoInteractions(requestCustomRepository, authorityDefaultService, jobQueryService);
    }

    @Test
    void findAllByStagingId() {
        ThirdPartyDataManagementImportRequestDTO requestDTO = ThirdPartyDataManagementImportRequestDTO.builder()
            .items(Set.of(1L))
            .year(Year.now())
            .build();
        StagingEmissionsMonitoringPlanEntity stagingAerEntity = StagingEmissionsMonitoringPlanEntity.builder().id(1L).build();
        List<StagingEmissionsMonitoringPlanEntity> expected = List.of(stagingAerEntity);
        when(repository.findAllByIdIn(requestDTO.getItems())).thenReturn(expected);
        List<StagingEmissionsMonitoringPlanEntity> actual = handler.findAllByStagingId(requestDTO);

        assertThat(actual).isEqualTo(expected);

        verify(repository).findAllByIdIn(requestDTO.getItems());
        verifyNoInteractions(requestCustomRepository, authorityDefaultService, jobQueryService);
    }

    @Test
    void importData_STAGING_DATA_ALREADY_IMPORTED() {
        String userId = "userId";
        long stagingId = 1L;
        StagingEmissionsMonitoringPlanEntity stagingEntity = StagingEmissionsMonitoringPlanEntity.builder()
            .importStatus(StagingImportStatus.IMPORTED)
            .build();
        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.STAGING_DATA_ALREADY_IMPORTED;

        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));

        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);

        verify(repository).findByIdForUpdate(stagingId);
        verifyNoMoreInteractions(repository);
        verifyNoInteractions(requestCustomRepository, dateService, authorityDefaultService, jobQueryService);
    }

    @Test
    void importData_REQUEST_TASK_NOT_FOUND() {
        String userId = "userId";
        long stagingId = 1L;
        StagingEmissionsMonitoringPlanEntity stagingEntity = StagingEmissionsMonitoringPlanEntity.builder()
            .importStatus(StagingImportStatus.NEW)
            .accountId(ACCOUNT_ID)
            .build();
        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.REQUEST_TASK_NOT_FOUND;

        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));
        when(authorityDefaultService.existsByUserIdAndAccountId(userId, ACCOUNT_ID)).thenReturn(true);
        when(requestCustomRepository.findByAccountAndRequestTaskType(List.of(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_SUBMIT),
            MrtmRequestType.EMP_VARIATION,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString())).thenReturn(Optional.empty());

        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);

        verify(repository).findByIdForUpdate(stagingId);
        verify(authorityDefaultService).existsByUserIdAndAccountId(userId, ACCOUNT_ID);
        verify(requestCustomRepository).findByAccountAndRequestTaskType(List.of(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_SUBMIT),
            MrtmRequestType.EMP_VARIATION,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString());
        verifyNoMoreInteractions(requestCustomRepository, authorityDefaultService, repository);
        verifyNoInteractions(dateService, jobQueryService);
    }

    @Test
    void importData_USER_NOT_ASSIGNED_TO_ACCOUNT() {
        String userId = "userId";
        long stagingId = 1L;
        StagingEmissionsMonitoringPlanEntity stagingEntity = StagingEmissionsMonitoringPlanEntity.builder()
            .importStatus(StagingImportStatus.NEW)
            .accountId(ACCOUNT_ID)
            .build();
        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.USER_NOT_ASSIGNED_TO_ACCOUNT;

        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));
        when(authorityDefaultService.existsByUserIdAndAccountId(userId, ACCOUNT_ID)).thenReturn(false);

        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);

        verify(repository).findByIdForUpdate(stagingId);
        verify(authorityDefaultService).existsByUserIdAndAccountId(userId, ACCOUNT_ID);
        verifyNoMoreInteractions(authorityDefaultService, repository);
        verifyNoInteractions(requestCustomRepository, dateService, jobQueryService);
    }

    @Test
    void importData_SUCCESS() {
        LocalDateTime now = LocalDateTime.now();
        String userId = "userId";
        long stagingId = 1L;
        EmpMandate mandate = mock(EmpMandate.class);
        EmpMonitoringGreenhouseGas greenhouseGas = mock(EmpMonitoringGreenhouseGas.class);
        EmpManagementProcedures managementProcedures = mock(EmpManagementProcedures.class);
        EmpControlActivities controlActivities = mock(EmpControlActivities.class);
        EmpEmissionSources sources = mock(EmpEmissionSources.class);
        EmpDataGaps dataGaps = mock(EmpDataGaps.class);
        UUID ship1uuid = UUID.randomUUID();
        EmpEmissions expectedEmissions = EmpEmissions.builder()
            .ships(Set.of(
                EmpShipEmissions.builder()
                    .uniqueIdentifier(ship1uuid)
                    .details(mock(ShipDetails.class))
                    .fuelsAndEmissionsFactors(Set.of(mock(EmpFuelsAndEmissionsFactors.class)))
                    .emissionsSources(Set.of(mock(EmpEmissionsSources.class)))
                    .uncertaintyLevel(Set.of(mock(UncertaintyLevel.class)))
                    .carbonCapture(mock(EmpCarbonCapture.class))
                    .measurements(Set.of(mock(MeasurementDescription.class)))
                    .exemptionConditions(mock(ExemptionConditions.class))
                    .build()))
            .build();

        StagingEmissionsMonitoringPlanEntity stagingEntity = StagingEmissionsMonitoringPlanEntity.builder()
            .importStatus(StagingImportStatus.NEW)
            .payload(StagingEmissionsMonitoringPlan.builder()
                .emissions(expectedEmissions)
                .mandate(mandate)
                .sources(sources)
                .greenhouseGas(greenhouseGas)
                .managementProcedures(managementProcedures)
                .controlActivities(controlActivities)
                .dataGaps(dataGaps)
                .payloadType("stagingPayloadType")
                .build())
            .accountId(ACCOUNT_ID)
            .build();
        StagingEmissionsMonitoringPlanEntity expectedStagingEntity = StagingEmissionsMonitoringPlanEntity.builder()
            .payload(StagingEmissionsMonitoringPlan.builder().build())
            .accountId(ACCOUNT_ID)
            .payload(StagingEmissionsMonitoringPlan.builder()
                .emissions(expectedEmissions)
                .mandate(mandate)
                .sources(sources)
                .greenhouseGas(greenhouseGas)
                .managementProcedures(managementProcedures)
                .controlActivities(controlActivities)
                .dataGaps(dataGaps)
                .payloadType("stagingPayloadType")
                .build())
            .importStatus(StagingImportStatus.IMPORTED)
            .importedOn(now)
            .build();

        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.SUCCESS;
        Map<UUID, String> empAttachments = Map.of(UUID.randomUUID(), "filename");
        Map<String, String> existingEmpSectionsCompleted = new HashMap<>();
        existingEmpSectionsCompleted.put("a", "status");
        existingEmpSectionsCompleted.put("b", "status");
        existingEmpSectionsCompleted.put(SHIP_EMISSIONS.getKey() + UUID.randomUUID(), "status");
        existingEmpSectionsCompleted.put(CONTROL_ACTIVITIES.getKey(), "status");
        existingEmpSectionsCompleted.put(DATA_GAPS.getKey(), "status");
        existingEmpSectionsCompleted.put(EMISSIONS.getKey(), "status");
        existingEmpSectionsCompleted.put(GREENHOUSE_GAS.getKey(), "status");
        existingEmpSectionsCompleted.put(MANAGEMENT_PROCEDURES.getKey(), "status");
        existingEmpSectionsCompleted.put(MANDATE.getKey(), "status");
        existingEmpSectionsCompleted.put(SOURCES.getKey(), "status");

        Map<String, String> expectedEmpSectionsCompleted = new HashMap<>();
        expectedEmpSectionsCompleted.put("a", "status");
        expectedEmpSectionsCompleted.put("b", "status");
        expectedEmpSectionsCompleted.put(SHIP_EMISSIONS.getKey() + ship1uuid, "COMPLETED");
        expectedEmpSectionsCompleted.put(CONTROL_ACTIVITIES.getKey(), "COMPLETED");
        expectedEmpSectionsCompleted.put(DATA_GAPS.getKey(), "COMPLETED");
        expectedEmpSectionsCompleted.put(EMISSIONS.getKey(), "COMPLETED");
        expectedEmpSectionsCompleted.put(GREENHOUSE_GAS.getKey(), "COMPLETED");
        expectedEmpSectionsCompleted.put(MANAGEMENT_PROCEDURES.getKey(), "COMPLETED");
        expectedEmpSectionsCompleted.put(MANDATE.getKey(), "COMPLETED");
        expectedEmpSectionsCompleted.put(SOURCES.getKey(), "COMPLETED");

        EmpOperatorDetails operatorDetails = mock(EmpOperatorDetails.class);
        AdditionalDocuments additionalDocuments = mock(AdditionalDocuments.class);
        EmpAbbreviations abbreviations = mock(EmpAbbreviations.class);
        EmissionsMonitoringPlan actualEmissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .abbreviations(abbreviations)
            .additionalDocuments(additionalDocuments)
            .controlActivities(mock(EmpControlActivities.class))
            .operatorDetails(operatorDetails)
            .managementProcedures(mock(EmpManagementProcedures.class))
            .dataGaps(mock(EmpDataGaps.class))
            .emissions(mock(EmpEmissions.class))
            .sources(mock(EmpEmissionSources.class))
            .greenhouseGas(mock(EmpMonitoringGreenhouseGas.class))
            .mandate(mock(EmpMandate.class))
            .build();
        EmissionsMonitoringPlan expectedEmissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .abbreviations(abbreviations)
            .additionalDocuments(additionalDocuments)
            .controlActivities(controlActivities)
            .operatorDetails(operatorDetails)
            .managementProcedures(managementProcedures)
            .dataGaps(dataGaps)
            .emissions(expectedEmissions)
            .sources(sources)
            .greenhouseGas(greenhouseGas)
            .mandate(mandate)
            .build();

        EmpVariationApplicationSubmitRequestTaskPayload existingPayload = EmpVariationApplicationSubmitRequestTaskPayload.builder()
            .emissionsMonitoringPlan(actualEmissionsMonitoringPlan)
            .empSectionsCompleted(existingEmpSectionsCompleted)
            .empAttachments(empAttachments)
            .payloadType("payloadType")
            .build();
        EmpVariationApplicationSubmitRequestTaskPayload expectedPayload = EmpVariationApplicationSubmitRequestTaskPayload.builder()
            .emissionsMonitoringPlan(expectedEmissionsMonitoringPlan)
            .empSectionsCompleted(expectedEmpSectionsCompleted)
            .empAttachments(empAttachments)
            .payloadType("payloadType")
            .build();

        RequestTask task = RequestTask.builder()
            .payload(existingPayload)
            .build();

        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));
        when(dateService.getLocalDateTime()).thenReturn(now);
        when(authorityDefaultService.existsByUserIdAndAccountId(userId, ACCOUNT_ID)).thenReturn(true);
        when(requestCustomRepository.findByAccountAndRequestTaskType(List.of(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_SUBMIT),
            MrtmRequestType.EMP_VARIATION,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString())).thenReturn(Optional.of(task));

        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);
        assertThat(stagingEntity).isEqualTo(expectedStagingEntity);
        assertThat(task.getPayload()).isEqualTo(expectedPayload);

        verify(repository).findByIdForUpdate(stagingId);
        verify(dateService).getLocalDateTime();
        verify(authorityDefaultService).existsByUserIdAndAccountId(userId, ACCOUNT_ID);
        verify(requestCustomRepository).findByAccountAndRequestTaskType(List.of(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_SUBMIT),
            MrtmRequestType.EMP_VARIATION,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString());
        verifyNoMoreInteractions(requestCustomRepository, authorityDefaultService, dateService, repository);
        verifyNoInteractions(jobQueryService);
    }

    @Test
    void importData_GENERIC_ERROR() {
        String userId = "userId";
        long stagingId = 1L;
        StagingEmissionsMonitoringPlanEntity stagingEntity = StagingEmissionsMonitoringPlanEntity.builder()
            .importStatus(StagingImportStatus.NEW)
            .accountId(ACCOUNT_ID)
            .build();
        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.GENERIC_ERROR;

        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));
        when(authorityDefaultService.existsByUserIdAndAccountId(userId, ACCOUNT_ID)).thenReturn(true);
        doThrow(new BusinessException(ErrorCode.RESOURCE_NOT_FOUND))
            .when(requestCustomRepository).findByAccountAndRequestTaskType(List.of(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_SUBMIT),
            MrtmRequestType.EMP_VARIATION,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString());

        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);

        verify(authorityDefaultService).existsByUserIdAndAccountId(userId, ACCOUNT_ID);
        verify(repository).findByIdForUpdate(stagingId);
        verify(requestCustomRepository).findByAccountAndRequestTaskType(List.of(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_SUBMIT),
            MrtmRequestType.EMP_VARIATION,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString());
        verifyNoMoreInteractions(requestCustomRepository, authorityDefaultService, repository);
        verifyNoInteractions(dateService, jobQueryService);
    }

    @Test
    void createImportBatch_error() {
        long transactionId = 1L;
        long stagingId1 = 2L;
        long stagingId2 = 3L;
        StagingEmissionsMonitoringPlanEntity stagingEntity1 = mock(StagingEmissionsMonitoringPlanEntity.class);
        ThirdPartyDataManagementImportRequestDTO requestDTO = ThirdPartyDataManagementImportRequestDTO.builder()
            .items(Set.of(stagingId1, stagingId2))
            .build();

        when(repository.findAllByIdIn(Set.of(stagingId1, stagingId2))).thenReturn(List.of(stagingEntity1));
        BusinessException be = assertThrows(BusinessException.class,
            () -> handler.createImportBatch(transactionId, requestDTO));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);

        verify(repository).findAllByIdIn(Set.of(stagingId1, stagingId2));
        verifyNoMoreInteractions(repository);
        verifyNoInteractions(dateService, jobQueryService, requestCustomRepository, authorityDefaultService);
    }

    @Test
    void createImportBatch_success() {
        long transactionId = 1L;
        long stagingId1 = 2L;
        long stagingId2 = 3L;
        StagingEmissionsMonitoringPlanEntity stagingEntity1 = mock(StagingEmissionsMonitoringPlanEntity.class);
        StagingEmissionsMonitoringPlanEntity stagingEntity2 = mock(StagingEmissionsMonitoringPlanEntity.class);
        ThirdPartyDataManagementImportRequestDTO requestDTO = ThirdPartyDataManagementImportRequestDTO.builder()
            .items(Set.of(stagingId1, stagingId2))
            .build();

        when(repository.findAllByIdIn(Set.of(stagingId1, stagingId2))).thenReturn(List.of(stagingEntity1, stagingEntity2));
        when(jobQueryService.createJobs(transactionId, List.of(stagingEntity1, stagingEntity2))).thenReturn(Set.of(stagingId1, stagingId2));
        Set<Long> actual = handler.createImportBatch(transactionId, requestDTO);

        assertThat(actual).isEqualTo(Set.of(stagingId1, stagingId2));

        verify(repository).findAllByIdIn(Set.of(stagingId1, stagingId2));
        verify(jobQueryService).createJobs(transactionId, List.of(stagingEntity1, stagingEntity2));
        verifyNoMoreInteractions(repository, jobQueryService);
        verifyNoInteractions(dateService, requestCustomRepository, authorityDefaultService);
    }
}