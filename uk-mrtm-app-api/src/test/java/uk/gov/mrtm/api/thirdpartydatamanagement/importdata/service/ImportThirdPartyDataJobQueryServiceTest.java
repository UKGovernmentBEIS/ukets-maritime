package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAerEntity;
import uk.gov.mrtm.api.integration.external.common.domain.BaseStagingEntity;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataJobEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataTransactionEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataJobRepository;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult.SCHEDULED;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class ImportThirdPartyDataJobQueryServiceTest {

    @InjectMocks
    private ImportThirdPartyDataJobQueryService service;

    @Mock
    private ImportThirdPartyDataJobRepository repository;
    @Mock
    private ImportThirdPartyDataTransactionQueryService transactionQueryService;
    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Test
    void createJobs() {
        long transactionId = 1L;
        Long stagingId1 = 2L;
        Long stagingId2 = 3L;
        Long accountId1 = 4L;
        Long accountId2 = 5L;
        MrtmAccount account1 = mock(MrtmAccount.class);
        MrtmAccount account2 = mock(MrtmAccount.class);
        Long jobId1 = 6L;
        Long jobId2 = 7L;
        Set<Long> expected = Set.of(jobId1, jobId2);
        ImportThirdPartyDataTransactionEntity transaction = mock(ImportThirdPartyDataTransactionEntity.class);
        StagingEmissionsMonitoringPlanEntity stagingEntity1 = StagingEmissionsMonitoringPlanEntity.builder()
            .id(stagingId1)
            .accountId(accountId1)
            .build();
        StagingAerEntity stagingEntity2 = StagingAerEntity.builder()
            .id(stagingId2)
            .accountId(accountId2)
            .build();
        ImportThirdPartyDataJobEntity jobEntity1 = ImportThirdPartyDataJobEntity.builder()
            .status(SCHEDULED)
            .stagingDataId(stagingId1)
            .transaction(transaction)
            .account(account1)
            .build();
        ImportThirdPartyDataJobEntity jobEntity2 = ImportThirdPartyDataJobEntity.builder()
            .status(SCHEDULED)
            .stagingDataId(stagingId2)
            .transaction(transaction)
            .account(account2)
            .build();
        ImportThirdPartyDataJobEntity savedJobEntity1 = ImportThirdPartyDataJobEntity.builder()
            .id(jobId1)
            .build();
        ImportThirdPartyDataJobEntity savedJobEntity2 = ImportThirdPartyDataJobEntity.builder()
            .id(jobId2)
            .build();
        List<BaseStagingEntity> items = List.of(stagingEntity1, stagingEntity2);

        when(transactionQueryService.getTransactionById(transactionId)).thenReturn(transaction);
        when(mrtmAccountQueryService.getAccountById(accountId1)).thenReturn(account1);
        when(mrtmAccountQueryService.getAccountById(accountId2)).thenReturn(account2);
        when(repository.saveAll(List.of(jobEntity1, jobEntity2))).thenReturn(List.of(savedJobEntity1, savedJobEntity2));

        Set<Long> actual = service.createJobs(transactionId, items);

        assertThat(expected).isEqualTo(actual);


        verify(transactionQueryService).getTransactionById(transactionId);
        verify(mrtmAccountQueryService).getAccountById(accountId1);
        verify(mrtmAccountQueryService).getAccountById(accountId2);
        verify(repository).saveAll(List.of(jobEntity1, jobEntity2));

        verifyNoMoreInteractions(repository, transactionQueryService, mrtmAccountQueryService);
    }

    @Test
    void getJobByIdForUpdate() {
        long id = 1L;
        ImportThirdPartyDataJobEntity job = mock(ImportThirdPartyDataJobEntity.class);

        when(repository.findByIdForUpdate(id)).thenReturn(Optional.of(job));
        ImportThirdPartyDataJobEntity response = service.getJobByIdForUpdate(id);

        assertEquals(job, response);

        verify(repository).findByIdForUpdate(id);
        verifyNoMoreInteractions(repository);
        verifyNoInteractions(transactionQueryService, mrtmAccountQueryService);
    }

    @Test
    void getJobByIdForUpdate_throws_exception() {
        long id = 1L;
        when(repository.findByIdForUpdate(id)).thenReturn(Optional.empty());

        BusinessException exception = assertThrows(BusinessException.class,
            () -> service.getJobByIdForUpdate(id));

        assertEquals(RESOURCE_NOT_FOUND, exception.getErrorCode());

        verify(repository).findByIdForUpdate(id);
        verifyNoMoreInteractions(repository);
        verifyNoInteractions(transactionQueryService, mrtmAccountQueryService);
    }
}