package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataTransactionEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataJobRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataTransactionRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.service.ThirdPartyDataManagementServiceResolver;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ThirdPartyDataManagementImportHandler;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataTransactionStatus;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.IMPORT_THIRD_PART_DATA_TRANSACTION_ID;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.STAGING_IDS;
import static uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants.REQUEST_TYPE;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataManagementImportCompletedHandlerFlowableTest {

    @InjectMocks
    private ThirdPartyDataManagementImportCompletedHandlerFlowable handler;

    @Mock
    private ThirdPartyDataManagementServiceResolver serviceResolver;
    @Mock
    private ImportThirdPartyDataTransactionRepository transactionRepository;
    @Mock
    private ImportThirdPartyDataJobRepository jobRepository;

    @Mock
    private DelegateExecution execution;

    @ParameterizedTest
    @MethodSource
    void execute(long successful, long failed, long total, ThirdPartyDataTransactionStatus status) {
        long transactionId = 1L;
        Set<Long> stagingIds = Set.of(2L, 3L);
        ImportThirdPartyDataTransactionEntity transaction = mock(ImportThirdPartyDataTransactionEntity.class);
        ThirdPartyDataRequestType requestType = mock(ThirdPartyDataRequestType.class);
        ThirdPartyDataManagementImportHandler service = mock(ThirdPartyDataManagementImportHandler.class);

        when(serviceResolver.resolveImportService(requestType)).thenReturn(service);
        when(execution.getVariable(IMPORT_THIRD_PART_DATA_TRANSACTION_ID)).thenReturn(transactionId);
        when(execution.getVariable(STAGING_IDS)).thenReturn(stagingIds);
        when(execution.getVariable(REQUEST_TYPE)).thenReturn(requestType);

        when(jobRepository.countByTransactionIdAndStatus(transactionId, ThirdPartyDataManagementImportResult.SUCCESS)).thenReturn(successful);
        when(jobRepository.countByTransactionIdAndStatusNot(transactionId, ThirdPartyDataManagementImportResult.SUCCESS)).thenReturn(failed);
        when(jobRepository.countByTransactionId(transactionId)).thenReturn(total);

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(transaction));

        handler.execute(execution);

        verify(transaction).setStatus(status);
        verify(serviceResolver).resolveImportService(requestType);
        verify(execution).getVariable(IMPORT_THIRD_PART_DATA_TRANSACTION_ID);
        verify(execution).getVariable(REQUEST_TYPE);
        verify(execution).getVariable(STAGING_IDS);
        verify(jobRepository).countByTransactionIdAndStatus(transactionId, ThirdPartyDataManagementImportResult.SUCCESS);
        verify(jobRepository).countByTransactionIdAndStatusNot(transactionId, ThirdPartyDataManagementImportResult.SUCCESS);
        verify(jobRepository).countByTransactionId(transactionId);
        verify(service).markNotInProgress(stagingIds);
        verify(transactionRepository).findById(transactionId);

        verifyNoMoreInteractions(transaction, service, serviceResolver, transactionRepository);
    }

    private static Stream<Arguments> execute() {
        return Stream.of(
            Arguments.of(10, 0, 10, ThirdPartyDataTransactionStatus.COMPLETED),
            Arguments.of(0, 10, 10, ThirdPartyDataTransactionStatus.FAILED),
            Arguments.of(5, 5, 10, ThirdPartyDataTransactionStatus.COMPLETED_WITH_FAILURES)
        );
    }
}