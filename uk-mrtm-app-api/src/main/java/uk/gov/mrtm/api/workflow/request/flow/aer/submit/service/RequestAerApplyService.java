package uk.gov.mrtm.api.workflow.request.flow.aer.submit.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAer;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAerEntity;
import uk.gov.mrtm.api.integration.external.aer.repository.StagingAerRepository;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerAggregatedDataEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerPortEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSmfEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSubmitRequestTaskSyncAerAttachmentsService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerTotalEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerVoyageEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerImportThirdPartyDataRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper.AerMapper;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import static uk.gov.mrtm.api.common.exception.MrtmErrorCode.AER_IMPORT_EXTERNAL_DATA_NOT_ALLOWED;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class RequestAerApplyService {
	
	private final AerSubmitRequestTaskSyncAerAttachmentsService syncAerAttachmentsService;
    private final AerPortEmissionsCalculator portEmissionsCalculator;
    private final AerVoyageEmissionsCalculator voyageEmissionsCalculator;
    private final AerAggregatedDataEmissionsCalculator aggregatedDataEmissionsCalculator;
    private final AerSmfEmissionsCalculator smfEmissionsCalculator;
    private final AerTotalEmissionsCalculator totalEmissionsCalculator;
    private final StagingAerRepository stagingAerRepository;
    private final DateService dateService;

    private static final AerMapper AER_MAPPER = Mappers.getMapper(AerMapper.class);

    @Transactional
    public void applySaveAction(AerSaveApplicationRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {
		AerApplicationSubmitRequestTaskPayload taskPayload =
            (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();
		syncAerAttachmentsService.sync(taskActionPayload.getReportingRequired(), taskPayload);

        Aer aer = AER_MAPPER.toAer(taskActionPayload.getAer(), taskPayload.getAer());
        performCalculations(aer);

        taskPayload.setAer(aer);
        taskPayload.setAerSectionsCompleted(taskActionPayload.getAerSectionsCompleted());

        taskPayload.setReportingRequired(taskActionPayload.getReportingRequired());
        taskPayload.setReportingObligationDetails(taskActionPayload.getReportingObligationDetails());

        // Reset verification
        taskPayload.setVerificationPerformed(false);
    }

    @Transactional
    public void applyStagingData(RequestTask requestTask,
                                 AerImportThirdPartyDataRequestTaskActionPayload requestTaskActionPayload) {

        AerApplicationSubmitRequestTaskPayload taskPayload =
            (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        if (BooleanUtils.isNotTrue(taskPayload.getReportingRequired())) {
            throw new BusinessException(AER_IMPORT_EXTERNAL_DATA_NOT_ALLOWED);
        }

        StagingAerEntity stagingAerEntity = stagingAerRepository
            .findByAccountIdAndYear(requestTask.getRequest().getAccountId(), taskPayload.getReportingYear())
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        StagingAer stagingPayload = (StagingAer) stagingAerEntity.getPayload();
        Aer aer = taskPayload.getAer();

        aer.setEmissions(stagingPayload.getEmissions());
        aer.setSmf(stagingPayload.getSmf());
        aer.setAggregatedData(stagingPayload.getAggregatedData());
        aer.setThirdPartyDataProviderName(stagingAerEntity.getProviderName());
        performCalculations(aer);

        stagingAerEntity.setImportedOn(dateService.getLocalDateTime());

        taskPayload.setAerSectionsCompleted(requestTaskActionPayload.getAerSectionsCompleted());

        // Reset verification
        taskPayload.setVerificationPerformed(false);
    }

    private void performCalculations(Aer aer) {
        portEmissionsCalculator.calculateEmissions(aer);
        voyageEmissionsCalculator.calculateEmissions(aer);
        smfEmissionsCalculator.calculateEmissions(aer);
        aggregatedDataEmissionsCalculator.calculateEmissions(aer);
        totalEmissionsCalculator.calculateEmissions(aer);
    }
}
