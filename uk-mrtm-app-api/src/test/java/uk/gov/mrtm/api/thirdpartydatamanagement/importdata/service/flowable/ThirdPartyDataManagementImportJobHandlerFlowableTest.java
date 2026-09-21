package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataJobEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataJobRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.service.ThirdPartyDataManagementServiceResolver;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ImportThirdPartyDataJobQueryService;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ThirdPartyDataManagementImportHandler;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.IMPORT_THIRD_PART_DATA_TRANSACTION_JOB_ID;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.SUBMITTER_ID;
import static uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants.REQUEST_TYPE;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataManagementImportJobHandlerFlowableTest {

    @InjectMocks
    private ThirdPartyDataManagementImportJobHandlerFlowable service;

    @Mock
    private ThirdPartyDataManagementServiceResolver serviceResolver;
    @Mock
    private ImportThirdPartyDataJobQueryService jobQueryService;
    @Mock
    private ImportThirdPartyDataJobRepository jobRepository;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() {
        long jobId = 1L;
        long stagingDataId = 2L;
        String submitterId = "submitterId";
        ThirdPartyDataRequestType thirdPartyDataRequestType = mock(ThirdPartyDataRequestType.class);
        ThirdPartyDataManagementImportHandler importHandler = mock(ThirdPartyDataManagementImportHandler.class);
        ThirdPartyDataManagementImportResult importResult = mock(ThirdPartyDataManagementImportResult.class);
        ImportThirdPartyDataJobEntity job = ImportThirdPartyDataJobEntity.builder()
            .status(ThirdPartyDataManagementImportResult.SCHEDULED)
            .stagingDataId(stagingDataId)
            .build();

        when(serviceResolver.resolveImportService(thirdPartyDataRequestType)).thenReturn(importHandler);
        when(execution.getVariable(IMPORT_THIRD_PART_DATA_TRANSACTION_JOB_ID)).thenReturn(jobId);
        when(execution.getVariable(SUBMITTER_ID)).thenReturn(submitterId);
        when(execution.getVariable(REQUEST_TYPE)).thenReturn(thirdPartyDataRequestType);
        when(importHandler.importData(stagingDataId, submitterId)).thenReturn(importResult);
        when(jobQueryService.getJobByIdForUpdate(jobId)).thenReturn(job);

        service.execute(execution);


        verify(serviceResolver).resolveImportService(thirdPartyDataRequestType);
        verify(execution).getVariable(IMPORT_THIRD_PART_DATA_TRANSACTION_JOB_ID);
        verify(execution).getVariable(SUBMITTER_ID);
        verify(execution).getVariable(REQUEST_TYPE);
        verify(jobQueryService).getJobByIdForUpdate(jobId);
        verify(jobRepository).updateStatus(jobId, importResult.name());
        verify(importHandler).importData(stagingDataId, submitterId);

        verifyNoMoreInteractions(importHandler, jobRepository, jobQueryService, jobRepository, execution);
    }

    @Test
    void execute_throws_exception() {
        long jobId = 1L;
        long stagingDataId = 2L;
        String submitterId = "submitterId";
        ThirdPartyDataRequestType thirdPartyDataRequestType = mock(ThirdPartyDataRequestType.class);
        ThirdPartyDataManagementImportHandler importHandler = mock(ThirdPartyDataManagementImportHandler.class);
        ImportThirdPartyDataJobEntity job = ImportThirdPartyDataJobEntity.builder()
            .status(ThirdPartyDataManagementImportResult.SCHEDULED)
            .stagingDataId(stagingDataId)
            .build();

        when(serviceResolver.resolveImportService(thirdPartyDataRequestType)).thenReturn(importHandler);
        when(execution.getVariable(IMPORT_THIRD_PART_DATA_TRANSACTION_JOB_ID)).thenReturn(jobId);
        when(execution.getVariable(SUBMITTER_ID)).thenReturn(submitterId);
        when(execution.getVariable(REQUEST_TYPE)).thenReturn(thirdPartyDataRequestType);
        doThrow(new BusinessException(ErrorCode.INTERNAL_SERVER)).when(importHandler).importData(stagingDataId, submitterId);
        when(jobQueryService.getJobByIdForUpdate(jobId)).thenReturn(job);

        service.execute(execution);


        verify(serviceResolver).resolveImportService(thirdPartyDataRequestType);
        verify(execution).getVariable(IMPORT_THIRD_PART_DATA_TRANSACTION_JOB_ID);
        verify(execution).getVariable(SUBMITTER_ID);
        verify(execution).getVariable(REQUEST_TYPE);
        verify(jobQueryService).getJobByIdForUpdate(jobId);
        verify(jobRepository).updateStatus(jobId, ThirdPartyDataManagementImportResult.GENERIC_ERROR.name());
        verify(importHandler).importData(stagingDataId, submitterId);

        verifyNoMoreInteractions(importHandler, jobRepository, jobQueryService, jobRepository, execution);
    }

    @ParameterizedTest
    @EnumSource(value = ThirdPartyDataManagementImportResult.class, names = {"SCHEDULED"}, mode = EnumSource.Mode.EXCLUDE)
    void execute_not_scheduled(ThirdPartyDataManagementImportResult status) {
        long jobId = 1L;
        String submitterId = "submitterId";
        ThirdPartyDataRequestType thirdPartyDataRequestType = mock(ThirdPartyDataRequestType.class);
        ImportThirdPartyDataJobEntity job = ImportThirdPartyDataJobEntity.builder()
            .status(status)
            .build();

        when(execution.getVariable(IMPORT_THIRD_PART_DATA_TRANSACTION_JOB_ID)).thenReturn(jobId);
        when(execution.getVariable(SUBMITTER_ID)).thenReturn(submitterId);
        when(execution.getVariable(REQUEST_TYPE)).thenReturn(thirdPartyDataRequestType);
        when(jobQueryService.getJobByIdForUpdate(jobId)).thenReturn(job);

        service.execute(execution);

        verify(execution).getVariable(IMPORT_THIRD_PART_DATA_TRANSACTION_JOB_ID);
        verify(execution).getVariable(SUBMITTER_ID);
        verify(execution).getVariable(REQUEST_TYPE);
        verify(jobQueryService).getJobByIdForUpdate(jobId);
        verifyNoMoreInteractions(execution, jobQueryService);
        verifyNoInteractions(serviceResolver, jobRepository);
    }
}