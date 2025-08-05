package uk.gov.mrtm.api.workflow.request.flow.aer.submit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerAggregatedDataEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerPortEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSmfEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSubmitRequestTaskSyncAerAttachmentsService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerTotalEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerVoyageEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper.AerMapper;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

@Service
@RequiredArgsConstructor
public class RequestAerApplyService {
	
	private final AerSubmitRequestTaskSyncAerAttachmentsService syncAerAttachmentsService;
    private final AerPortEmissionsCalculator portEmissionsCalculator;
    private final AerVoyageEmissionsCalculator voyageEmissionsCalculator;
    private final AerAggregatedDataEmissionsCalculator aggregatedDataEmissionsCalculator;
    private final AerSmfEmissionsCalculator smfEmissionsCalculator;
    private final AerTotalEmissionsCalculator totalEmissionsCalculator;

    private static final AerMapper AER_MAPPER = Mappers.getMapper(AerMapper.class);

    @Transactional
    public void applySaveAction(AerSaveApplicationRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {
		AerApplicationSubmitRequestTaskPayload taskPayload =
            (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();
		syncAerAttachmentsService.sync(taskActionPayload.getReportingRequired(), taskPayload);

        Aer aer = AER_MAPPER.toAer(taskActionPayload.getAer());
        portEmissionsCalculator.calculateEmissions(aer);
        voyageEmissionsCalculator.calculateEmissions(aer);
        smfEmissionsCalculator.calculateEmissions(aer);
        aggregatedDataEmissionsCalculator.calculateEmissions(aer);
        totalEmissionsCalculator.calculateEmissions(aer);

        taskPayload.setAer(aer);
        taskPayload.setAerSectionsCompleted(taskActionPayload.getAerSectionsCompleted());

        taskPayload.setReportingRequired(taskActionPayload.getReportingRequired());
        taskPayload.setReportingObligationDetails(taskActionPayload.getReportingObligationDetails());

        // Reset verification
        taskPayload.setVerificationPerformed(false);
    }
}
