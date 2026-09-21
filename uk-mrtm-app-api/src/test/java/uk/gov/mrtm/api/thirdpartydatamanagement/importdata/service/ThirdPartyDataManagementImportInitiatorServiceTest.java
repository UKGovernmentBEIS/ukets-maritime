package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataTransactionEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.service.ThirdPartyDataManagementServiceResolver;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;

import java.time.Year;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.IMPORT_THIRD_PART_DATA_TRANSACTION_ID;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.IMPORT_THIRD_PART_DATA_TRANSACTION_JOBS;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.STAGING_IDS;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.SUBMITTER_ID;
import static uk.gov.netz.api.workflow.request.WorkflowService.BUSINESS_KEY_PREFIX;
import static uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants.REQUEST_TYPE;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataManagementImportInitiatorServiceTest {

    @InjectMocks
    private ThirdPartyDataManagementImportInitiatorService delegator;

    @Mock
    private ThirdPartyDataManagementServiceResolver serviceResolver;
    @Mock
    private ImportThirdPartyDataTransactionQueryService transactionQueryService;
    @Mock
    private WorkflowService workflowService;

    @Test
    void initiateImport() {
        Year year = Year.now();
        String userId = "userId";
        long transactionId = 1L;
        ImportThirdPartyDataTransactionEntity transaction = ImportThirdPartyDataTransactionEntity.builder()
            .id(transactionId)
            .build();
        String processInstanceId = "processInstanceId";
        ImportThirdPartyDataTransactionEntity expectedTransaction = ImportThirdPartyDataTransactionEntity.builder()
            .id(transactionId)
            .processInstanceId(processInstanceId)
            .build();

        String businessKey = BUSINESS_KEY_PREFIX + "PROCESS_IMPORT_THIRD_PART_DATA_BATCH" + transactionId;
        Set<Long> transactionJobs = Set.of(2L, 3L);
        ThirdPartyDataManagementImportHandler importService = mock(ThirdPartyDataManagementImportHandler.class);
        AppUser appUser = AppUser.builder().userId(userId).build();
        ThirdPartyDataRequestType requestType = mock(ThirdPartyDataRequestType.class);
        Set<Long> items = Set.of(4L, 5L);
        ThirdPartyDataManagementImportRequestDTO requestDTO = ThirdPartyDataManagementImportRequestDTO.builder()
            .year(year)
            .requestType(requestType)
            .items(items)
            .build();
        Map<String, Object> processVars = Map.of(
            SUBMITTER_ID, appUser.getUserId(),
            STAGING_IDS, requestDTO.getItems(),
            REQUEST_TYPE, requestDTO.getRequestType(),
            IMPORT_THIRD_PART_DATA_TRANSACTION_JOBS, transactionJobs,
            IMPORT_THIRD_PART_DATA_TRANSACTION_ID,  transactionId);

        when(serviceResolver.resolveImportService(requestType)).thenReturn(importService);
        when(transactionQueryService.createTransaction(appUser, requestDTO)).thenReturn(transaction);
        when(importService.createImportBatch(transactionId, requestDTO)).thenReturn(transactionJobs);
        when(workflowService.startProcessDefinitionByKey("PROCESS_IMPORT_THIRD_PART_DATA_BATCH", businessKey, processVars)).thenReturn(processInstanceId);

        delegator.initiateImport(appUser, requestDTO);

        assertThat(expectedTransaction).isEqualTo(transaction);

        verify(serviceResolver).resolveImportService(requestType);
        verify(transactionQueryService).createTransaction(appUser, requestDTO);
        verify(importService).createImportBatch(transactionId, requestDTO);
        verify(importService).markInProgress(items);
        verify(workflowService).startProcessDefinitionByKey("PROCESS_IMPORT_THIRD_PART_DATA_BATCH", businessKey, processVars);

        verifyNoMoreInteractions(serviceResolver, transactionQueryService, workflowService, importService);
    }

}