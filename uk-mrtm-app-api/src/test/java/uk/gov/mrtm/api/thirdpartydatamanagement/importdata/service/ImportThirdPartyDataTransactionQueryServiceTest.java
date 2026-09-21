package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataTransactionEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataTransactionRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataTransactionStatus;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.utils.DateService;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class ImportThirdPartyDataTransactionQueryServiceTest {

    @InjectMocks
    private ImportThirdPartyDataTransactionQueryService service;

    @Mock
    private DateService dateService;
    @Mock
    private ImportThirdPartyDataTransactionRepository repository;

    @Test
    void createTransaction() {
        Year year = Year.now();
        LocalDateTime now = LocalDateTime.now();
        long transactionId = 1L;
        String userId = "userId";
        String submitterName = "firstName lastName";
        AppUser appUser = AppUser.builder().userId(userId).firstName("firstName").lastName("lastName").build();
        ThirdPartyDataRequestType requestType = mock(ThirdPartyDataRequestType.class);
        ThirdPartyDataManagementImportRequestDTO requestDTO = ThirdPartyDataManagementImportRequestDTO.builder()
            .year(year)
            .requestType(requestType)
            .build();
        ImportThirdPartyDataTransactionEntity importThirdPartyDataTransactionEntity = ImportThirdPartyDataTransactionEntity.builder()
            .status(ThirdPartyDataTransactionStatus.IN_PROGRESS)
            .type(requestType)
            .year(year)
            .createdOn(now)
            .submitterId(userId)
            .submitterName(submitterName)
            .build();

        ImportThirdPartyDataTransactionEntity savedImportThirdPartyDataTransactionEntity = ImportThirdPartyDataTransactionEntity.builder()
            .id(transactionId)
            .build();

        when(dateService.getLocalDateTime()).thenReturn(now);
        when(repository.save(importThirdPartyDataTransactionEntity)).thenReturn(savedImportThirdPartyDataTransactionEntity);

        ImportThirdPartyDataTransactionEntity actual = service.createTransaction(appUser, requestDTO);

        assertEquals(savedImportThirdPartyDataTransactionEntity, actual);

        verify(dateService).getLocalDateTime();
        verify(repository).save(importThirdPartyDataTransactionEntity);
        verifyNoMoreInteractions(repository, dateService);
    }

    @Test
    void getTransactionById() {
        long id = 1L;
        ImportThirdPartyDataTransactionEntity job = mock(ImportThirdPartyDataTransactionEntity.class);

        when(repository.findById(id)).thenReturn(Optional.of(job));
        ImportThirdPartyDataTransactionEntity response = service.getTransactionById(id);

        assertEquals(job, response);

        verify(repository).findById(id);
        verifyNoMoreInteractions(repository);
        verifyNoInteractions(dateService);
    }

    @Test
    void getTransactionById_throws_exception() {
        long id = 1L;
        when(repository.findById(id)).thenReturn(Optional.empty());

        BusinessException exception = assertThrows(BusinessException.class,
            () -> service.getTransactionById(id));

        assertEquals(RESOURCE_NOT_FOUND, exception.getErrorCode());

        verify(repository).findById(id);
        verifyNoMoreInteractions(repository);
        verifyNoInteractions(dateService);
    }
}