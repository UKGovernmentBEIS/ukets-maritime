package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.aer;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAer;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAerEntity;
import uk.gov.mrtm.api.integration.external.aer.repository.StagingAerRepository;
import uk.gov.mrtm.api.integration.external.common.domain.StagingImportStatus;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ImportThirdPartyDataJobQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.service.RequestAerApplyService;
import uk.gov.netz.api.authorization.core.service.AuthorityDefaultService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.AerSectionsCompleted.AGGREGATED_DATA;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.AerSectionsCompleted.EMISSIONS;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.AerSectionsCompleted.REPORTING_OBLIGATION;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.AerSectionsCompleted.SHIP_AGGREGATED_DATA;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.AerSectionsCompleted.SHIP_EMISSIONS;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.AerSectionsCompleted.SMF;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.AER_APPLICATION_AMENDS_SUBMIT;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.AER_APPLICATION_SUBMIT;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataManagementAerImportHandlerTest {

    private static final Long ACCOUNT_ID = 1L;

    @InjectMocks
    private ThirdPartyDataManagementAerImportHandler handler;

    @Mock
    private RequestCustomRepository requestCustomRepository;
    @Mock
    private AuthorityDefaultService authorityDefaultService;
    @Mock
    private ImportThirdPartyDataJobQueryService jobQueryService;
    @Mock
    private StagingAerRepository repository;
    @Mock
    private RequestAerApplyService requestAerApplyService;

    @Test
    void getRequestType() {
        assertThat(handler.getRequestType()).isEqualTo(ThirdPartyDataRequestType.AER);
    }

    @Test
    void markInProgress() {
        Set<Long> stagingIds = Set.of(1L);
        handler.markInProgress(stagingIds);

        verify(repository).updateImportStatusByIdIn(stagingIds, true);
        verifyNoInteractions(requestCustomRepository, authorityDefaultService,
            jobQueryService, requestAerApplyService);
    }

    @Test
    void markNotInProgress() {
        Set<Long> stagingIds = Set.of(1L);
        handler.markNotInProgress(stagingIds);

        verify(repository).updateImportStatusByIdIn(stagingIds, false);
        verifyNoInteractions(requestCustomRepository, authorityDefaultService,
            jobQueryService, requestAerApplyService);
    }

    @Test
    void findStagingEntityForUpdate() {
        Long stagingId = 1L;
        StagingAerEntity stagingAerEntity = StagingAerEntity.builder().id(stagingId).build();
        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingAerEntity));
        StagingAerEntity actual = handler.findStagingEntityForUpdate(stagingId);

        assertThat(actual).isEqualTo(stagingAerEntity);

        verify(repository).findByIdForUpdate(stagingId);
        verifyNoInteractions(requestCustomRepository, authorityDefaultService,
            jobQueryService, requestAerApplyService);
    }

    @Test
    void findAllByStagingId() {
        ThirdPartyDataManagementImportRequestDTO requestDTO = ThirdPartyDataManagementImportRequestDTO.builder()
            .items(Set.of(1L))
            .year(Year.now())
            .build();
        StagingAerEntity stagingAerEntity = StagingAerEntity.builder().id(1L).build();
        List<StagingAerEntity> expected = List.of(stagingAerEntity);
        when(repository.findAllByIdInAndYear(requestDTO.getItems(), requestDTO.getYear())).thenReturn(expected);
        List<StagingAerEntity> actual = handler.findAllByStagingId(requestDTO);

        assertThat(actual).isEqualTo(expected);

        verify(repository).findAllByIdInAndYear(requestDTO.getItems(), requestDTO.getYear());
        verifyNoInteractions(requestCustomRepository, authorityDefaultService,
            jobQueryService, requestAerApplyService);
    }

    @Test
    void importData_STAGING_DATA_ALREADY_IMPORTED() {
        String userId = "userId";
        long stagingId = 1L;
        StagingAerEntity stagingEntity = StagingAerEntity.builder()
            .importStatus(StagingImportStatus.IMPORTED)
            .build();
        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.STAGING_DATA_ALREADY_IMPORTED;

        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));


        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);

        verify(repository).findByIdForUpdate(stagingId);
        verifyNoMoreInteractions(repository);
        verifyNoInteractions(requestCustomRepository, authorityDefaultService, jobQueryService, requestAerApplyService);
    }

    @Test
    void importData_USER_NOT_ASSIGNED_TO_ACCOUNT() {
        String userId = "userId";
        long stagingId = 1L;
        StagingAerEntity stagingEntity = StagingAerEntity.builder()
            .importStatus(StagingImportStatus.NEW)
            .accountId(ACCOUNT_ID)
            .build();
        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.USER_NOT_ASSIGNED_TO_ACCOUNT;

        when(authorityDefaultService.existsByUserIdAndAccountId(userId, ACCOUNT_ID)).thenReturn(false);
        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));

        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);

        verify(repository).findByIdForUpdate(stagingId);
        verify(authorityDefaultService).existsByUserIdAndAccountId(userId, ACCOUNT_ID);
        verifyNoMoreInteractions(authorityDefaultService, repository);
        verifyNoInteractions(requestCustomRepository, jobQueryService, requestAerApplyService);
    }

    @Test
    void importData_REQUEST_TASK_NOT_FOUND() {
        String userId = "userId";
        Year year = Year.now();
        long stagingId = 1L;
        StagingAerEntity stagingEntity = StagingAerEntity.builder()
            .importStatus(StagingImportStatus.NEW)
            .accountId(ACCOUNT_ID)
            .year(year)
            .build();
        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.REQUEST_TASK_NOT_FOUND;

        when(authorityDefaultService.existsByUserIdAndAccountId(userId, ACCOUNT_ID)).thenReturn(true);
        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));
        when(requestCustomRepository.findByAccountRequestTaskTypeAndYear(List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT),
            MrtmRequestType.AER,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString(),
            year.getValue())).thenReturn(Optional.empty());

        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);

        verify(authorityDefaultService).existsByUserIdAndAccountId(userId, ACCOUNT_ID);
        verify(repository).findByIdForUpdate(stagingId);
        verify(requestCustomRepository).findByAccountRequestTaskTypeAndYear(List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT),
            MrtmRequestType.AER,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString(),
            year.getValue());
        verifyNoMoreInteractions(requestCustomRepository, authorityDefaultService, repository);
        verifyNoInteractions(jobQueryService, requestAerApplyService);
    }

    @Test
    void importData_REPORTING_NOT_REQUIRED() {
        String userId = "userId";
        long stagingId = 1L;
        Year year = Year.now();
        StagingAerEntity stagingEntity = StagingAerEntity.builder()
            .importStatus(StagingImportStatus.NEW)
            .accountId(ACCOUNT_ID)
            .year(year)
            .build();
        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.REPORTING_NOT_REQUIRED;
        AerApplicationSubmitRequestTaskPayload taskPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .reportingRequired(false)
            .build();

        when(authorityDefaultService.existsByUserIdAndAccountId(userId, ACCOUNT_ID)).thenReturn(true);
        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));
        when(requestCustomRepository.findByAccountRequestTaskTypeAndYear(List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT),
            MrtmRequestType.AER,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString(),
            year.getValue())).thenReturn(Optional.of(RequestTask.builder().payload(taskPayload).build()));

        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);

        verify(authorityDefaultService).existsByUserIdAndAccountId(userId, ACCOUNT_ID);
        verify(repository).findByIdForUpdate(stagingId);
        verify(requestCustomRepository).findByAccountRequestTaskTypeAndYear(List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT),
            MrtmRequestType.AER,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString(),
            year.getValue());
        verifyNoMoreInteractions(requestCustomRepository, authorityDefaultService, repository);
        verifyNoInteractions(jobQueryService, requestAerApplyService);
    }

    public static Stream<Arguments> importData_SUCCESS() {
        return Stream.of(
            Arguments.of(null, true, null, Aer.builder().build()),
            Arguments.of(true, true, Aer.builder().build(), Aer.builder().build())
        );
    }

    @MethodSource
    @ParameterizedTest
    void importData_SUCCESS(Boolean existingReportingRequired, Boolean expectedReportingRequired,
                               Aer existingAer, Aer expectedAer) {
        Year year = Year.now();
        String userId = "userId";
        long stagingId = 1L;
        UUID ship1uuid = UUID.randomUUID();
        UUID aggregatedData1uuid = UUID.randomUUID();
        AerEmissions emissions = AerEmissions.builder()
            .ships(Set.of(
                AerShipEmissions.builder()
                    .uniqueIdentifier(ship1uuid)
                    .build()))
            .build();

        AerAggregatedData aggregatedData = AerAggregatedData.builder()
            .emissions(Set.of(
                AerShipAggregatedData.builder()
                    .uniqueIdentifier(aggregatedData1uuid)
                    .build()))
            .build();

        StagingAerEntity stagingEntity = StagingAerEntity.builder()
            .importStatus(StagingImportStatus.NEW)
            .year(year)
            .payload(StagingAer.builder()
                .emissions(emissions)
                .aggregatedData(aggregatedData)
                .build())
            .accountId(ACCOUNT_ID)
            .build();

        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.SUCCESS;
        Map<UUID, String> aerAttachments = Map.of(UUID.randomUUID(), "filename");
        Map<String, String> existingAerSectionsCompleted = new HashMap<>();
        existingAerSectionsCompleted.put("a", "status");
        existingAerSectionsCompleted.put("b", "status");
        existingAerSectionsCompleted.put(SHIP_EMISSIONS.getKey() + UUID.randomUUID(), "status");
        existingAerSectionsCompleted.put(AGGREGATED_DATA.getKey(), "status");
        existingAerSectionsCompleted.put(SHIP_AGGREGATED_DATA.getKey() + UUID.randomUUID(), "status");
        existingAerSectionsCompleted.put(EMISSIONS.getKey(), "status");
        existingAerSectionsCompleted.put(SMF.getKey(), "status");
        existingAerSectionsCompleted.put(REPORTING_OBLIGATION.getKey(), "status");

        Map<String, String> expectedAerSectionsCompleted = new HashMap<>();
        expectedAerSectionsCompleted.put("a", "status");
        expectedAerSectionsCompleted.put("b", "status");
        expectedAerSectionsCompleted.put(SHIP_EMISSIONS.getKey() + ship1uuid, "COMPLETED");
        expectedAerSectionsCompleted.put(AGGREGATED_DATA.getKey(), "COMPLETED");
        expectedAerSectionsCompleted.put(SHIP_AGGREGATED_DATA.getKey() + aggregatedData1uuid, "COMPLETED");
        expectedAerSectionsCompleted.put(EMISSIONS.getKey(), "COMPLETED");
        expectedAerSectionsCompleted.put(SMF.getKey(), "IN_PROGRESS");
        expectedAerSectionsCompleted.put(REPORTING_OBLIGATION.getKey(), "COMPLETED");

        AerApplicationSubmitRequestTaskPayload existingPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .aer(existingAer)
            .reportingRequired(existingReportingRequired)
            .aerSectionsCompleted(existingAerSectionsCompleted)
            .aerAttachments(aerAttachments)
            .build();

        AerApplicationSubmitRequestTaskPayload expectedPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .aer(expectedAer)
            .reportingRequired(expectedReportingRequired)
            .aerSectionsCompleted(expectedAerSectionsCompleted)
            .aerAttachments(aerAttachments)
            .build();

        RequestTask task = RequestTask.builder()
            .payload(existingPayload)
            .build();

        when(authorityDefaultService.existsByUserIdAndAccountId(userId, ACCOUNT_ID)).thenReturn(true);
        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));
        when(requestCustomRepository.findByAccountRequestTaskTypeAndYear(List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT),
            MrtmRequestType.AER,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString(),
            year.getValue())).thenReturn(Optional.of(task));

        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);
        assertEquals(expectedPayload, task.getPayload());

        verify(requestAerApplyService).importAerFromStagingData(expectedPayload, stagingEntity);
        verify(repository).findByIdForUpdate(stagingId);
        verify(authorityDefaultService).existsByUserIdAndAccountId(userId, ACCOUNT_ID);
        verify(requestCustomRepository).findByAccountRequestTaskTypeAndYear(List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT),
            MrtmRequestType.AER,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString(),
            year.getValue());
        verifyNoMoreInteractions(requestCustomRepository, authorityDefaultService, requestAerApplyService, repository);
        verifyNoInteractions(jobQueryService);
    }

    @Test
    void importData_GENERIC_ERROR() {
        String userId = "userId";
        long stagingId = 1L;
        Year year = Year.now();
        StagingAerEntity stagingEntity = StagingAerEntity.builder()
            .importStatus(StagingImportStatus.NEW)
            .accountId(ACCOUNT_ID)
            .year(year)
            .build();
        ThirdPartyDataManagementImportResult expected = ThirdPartyDataManagementImportResult.GENERIC_ERROR;

        when(repository.findByIdForUpdate(stagingId)).thenReturn(Optional.of(stagingEntity));
        when(authorityDefaultService.existsByUserIdAndAccountId(userId, ACCOUNT_ID)).thenReturn(true);
        doThrow(new BusinessException(ErrorCode.RESOURCE_NOT_FOUND))
            .when(requestCustomRepository).findByAccountRequestTaskTypeAndYear(List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT),
                MrtmRequestType.AER,
                ResourceType.ACCOUNT,
                ACCOUNT_ID.toString(),
                year.getValue());

        ThirdPartyDataManagementImportResult actual = handler.importData(stagingId, userId);

        assertThat(actual).isEqualTo(expected);

        verify(authorityDefaultService).existsByUserIdAndAccountId(userId, ACCOUNT_ID);
        verify(repository).findByIdForUpdate(stagingId);
        verify(requestCustomRepository).findByAccountRequestTaskTypeAndYear(List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT),
            MrtmRequestType.AER,
            ResourceType.ACCOUNT,
            ACCOUNT_ID.toString(),
            year.getValue());
        verifyNoMoreInteractions(requestCustomRepository, authorityDefaultService, repository);
        verifyNoInteractions(jobQueryService);
    }

    @Test
    void createImportBatch_error() {
        long transactionId = 1L;
        long stagingId1 = 2L;
        long stagingId2 = 3L;
        StagingAerEntity stagingEntity1 = mock(StagingAerEntity.class);
        Year year = Year.now();
        ThirdPartyDataManagementImportRequestDTO requestDTO = ThirdPartyDataManagementImportRequestDTO.builder()
            .items(Set.of(stagingId1, stagingId2))
            .year(year)
            .build();

        when(repository.findAllByIdInAndYear(Set.of(stagingId1, stagingId2), year)).thenReturn(List.of(stagingEntity1));
        BusinessException be = assertThrows(BusinessException.class,
            () -> handler.createImportBatch(transactionId, requestDTO));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);

        verify(repository).findAllByIdInAndYear(Set.of(stagingId1, stagingId2), year);
        verifyNoMoreInteractions(repository);
        verifyNoInteractions(jobQueryService, requestCustomRepository, authorityDefaultService);
    }

    @Test
    void createImportBatch_success() {
        long transactionId = 1L;
        long stagingId1 = 2L;
        long stagingId2 = 3L;
        Year year = Year.now();
        StagingAerEntity stagingEntity1 = mock(StagingAerEntity.class);
        StagingAerEntity stagingEntity2 = mock(StagingAerEntity.class);
        ThirdPartyDataManagementImportRequestDTO requestDTO = ThirdPartyDataManagementImportRequestDTO.builder()
            .items(Set.of(stagingId1, stagingId2))
            .year(year)
            .build();

        when(repository.findAllByIdInAndYear(Set.of(stagingId1, stagingId2), year)).thenReturn(List.of(stagingEntity1, stagingEntity2));
        when(jobQueryService.createJobs(transactionId, List.of(stagingEntity1, stagingEntity2))).thenReturn(Set.of(stagingId1, stagingId2));
        Set<Long> actual = handler.createImportBatch(transactionId, requestDTO);

        assertThat(actual).isEqualTo(Set.of(stagingId1, stagingId2));

        verify(repository).findAllByIdInAndYear(Set.of(stagingId1, stagingId2), year);
        verify(jobQueryService).createJobs(transactionId, List.of(stagingEntity1, stagingEntity2));
        verifyNoMoreInteractions(repository, jobQueryService);
        verifyNoInteractions(requestCustomRepository, authorityDefaultService);
    }
}