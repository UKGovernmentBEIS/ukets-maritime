package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.flowable;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataJobRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataTransactionRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.service.ThirdPartyDataManagementServiceResolver;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ThirdPartyDataManagementImportHandler;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataTransactionStatus;

import java.util.Set;

import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.IMPORT_THIRD_PART_DATA_TRANSACTION_ID;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.STAGING_IDS;
import static uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants.REQUEST_TYPE;

@Service
@RequiredArgsConstructor
@Log4j2
public class ThirdPartyDataManagementImportCompletedHandlerFlowable implements JavaDelegate {

    private final ThirdPartyDataManagementServiceResolver serviceResolver;
    private final ImportThirdPartyDataTransactionRepository transactionRepository;
    private final ImportThirdPartyDataJobRepository jobRepository;

    @Override
    @Transactional
    public void execute(DelegateExecution execution) {
        final Long transactionId = (Long) execution.getVariable(IMPORT_THIRD_PART_DATA_TRANSACTION_ID);
        log.info("Import transaction with ID {} completed", transactionId);

        long successful = jobRepository.countByTransactionIdAndStatus(transactionId, ThirdPartyDataManagementImportResult.SUCCESS);
        long failed = jobRepository.countByTransactionIdAndStatusNot(transactionId, ThirdPartyDataManagementImportResult.SUCCESS);
        long total = jobRepository.countByTransactionId(transactionId);

        ThirdPartyDataTransactionStatus status;
        if (successful == total) {
            status = ThirdPartyDataTransactionStatus.COMPLETED;
        } else if (failed == total) {
            status = ThirdPartyDataTransactionStatus.FAILED;
        } else {
            status = ThirdPartyDataTransactionStatus.COMPLETED_WITH_FAILURES;
        }

        transactionRepository.findById(transactionId).ifPresent(transaction -> transaction.setStatus(status));

        final ThirdPartyDataRequestType requestType = (ThirdPartyDataRequestType) execution.getVariable(REQUEST_TYPE);
        final Set<Long> stagingIds = (Set<Long>) execution.getVariable(STAGING_IDS);
        ThirdPartyDataManagementImportHandler service = serviceResolver.resolveImportService(requestType);
        service.markNotInProgress(stagingIds);
    }
}
