package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.flowable;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataJobEntity;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataJobRepository;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.service.ThirdPartyDataManagementServiceResolver;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ImportThirdPartyDataJobQueryService;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ThirdPartyDataManagementImportHandler;

import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.IMPORT_THIRD_PART_DATA_TRANSACTION_JOB_ID;
import static uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants.SUBMITTER_ID;
import static uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants.REQUEST_TYPE;

@Service
@RequiredArgsConstructor
@Log4j2
public class ThirdPartyDataManagementImportJobHandlerFlowable implements JavaDelegate {

    private final ThirdPartyDataManagementServiceResolver serviceResolver;
    private final ImportThirdPartyDataJobQueryService jobQueryService;
    private final ImportThirdPartyDataJobRepository jobRepository;

    @Override
    @Transactional
    public void execute(DelegateExecution execution) {
        final Long jobId = (Long) execution.getVariable(IMPORT_THIRD_PART_DATA_TRANSACTION_JOB_ID);
        log.info("Starting import for job {}", jobId);

        try {

            final String submitterId = (String) execution.getVariable(SUBMITTER_ID);
            final ThirdPartyDataRequestType thirdPartyDataRequestType = (ThirdPartyDataRequestType) execution.getVariable(REQUEST_TYPE);

            ImportThirdPartyDataJobEntity job = jobQueryService.getJobByIdForUpdate(jobId);

            if (!ThirdPartyDataManagementImportResult.SCHEDULED.equals(job.getStatus())) {
                log.info("Job already executed, ID: {}", jobId);
                return;
            }

            ThirdPartyDataManagementImportHandler service = serviceResolver.resolveImportService(thirdPartyDataRequestType);
            ThirdPartyDataManagementImportResult importResult = service.importData(job.getStagingDataId(), submitterId);

            jobRepository.updateStatus(jobId, importResult.name());
        } catch (Exception e) {
            log.error("Failed to import job with ID {}", jobId, e);
            jobRepository.updateStatus(jobId, ThirdPartyDataManagementImportResult.GENERIC_ERROR.name());
        }

    }
}
