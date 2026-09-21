package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataTransactionEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.service.ThirdPartyDataManagementServiceResolver;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;

import java.util.Map;
import java.util.Set;

import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.IMPORT_THIRD_PART_DATA_TRANSACTION_ID;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.IMPORT_THIRD_PART_DATA_TRANSACTION_JOBS;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.STAGING_IDS;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.SUBMITTER_ID;
import static uk.gov.netz.api.workflow.request.WorkflowService.BUSINESS_KEY_PREFIX;
import static uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants.REQUEST_TYPE;

@Service
@RequiredArgsConstructor
public class ThirdPartyDataManagementImportInitiatorService {

    private final ThirdPartyDataManagementServiceResolver serviceResolver;
    private final ImportThirdPartyDataTransactionQueryService transactionQueryService;
    private final WorkflowService workflowService;
    private static final String PROCESS_IMPORT_THIRD_PART_DATA_BATCH_PROCESS_ID = "PROCESS_IMPORT_THIRD_PART_DATA_BATCH";

    @Transactional
    public void initiateImport(AppUser appUser, ThirdPartyDataManagementImportRequestDTO requestDTO) {
        ThirdPartyDataManagementImportHandler importService = serviceResolver.resolveImportService(requestDTO.getRequestType());
        ImportThirdPartyDataTransactionEntity transaction = transactionQueryService.createTransaction(appUser, requestDTO);
        Long transactionId = transaction.getId();

        Set<Long> transactionJobs = importService.createImportBatch(transactionId, requestDTO);
        importService.markInProgress(requestDTO.getItems());

        Map<String, Object> processVars = Map.of(
            SUBMITTER_ID, appUser.getUserId(),
            STAGING_IDS, requestDTO.getItems(),
            REQUEST_TYPE, requestDTO.getRequestType(),
            IMPORT_THIRD_PART_DATA_TRANSACTION_JOBS, transactionJobs,
            IMPORT_THIRD_PART_DATA_TRANSACTION_ID,  transactionId);

        String businessKey = BUSINESS_KEY_PREFIX + PROCESS_IMPORT_THIRD_PART_DATA_BATCH_PROCESS_ID + transactionId;
        String processInstanceId = workflowService.startProcessDefinitionByKey(PROCESS_IMPORT_THIRD_PART_DATA_BATCH_PROCESS_ID, businessKey, processVars);
        transaction.setProcessInstanceId(processInstanceId);
    }

}
