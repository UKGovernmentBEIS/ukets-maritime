package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class EmpVariationPopulateRequestMetadataService {

    private final RequestService requestService;
    private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

    @Transactional
    public void populateRequestMetadata(String requestId, boolean isRegulatorLed) {
        final Request request = requestService.findRequestById(requestId);
        final EmpVariationRequestMetadata requestMetadata = (EmpVariationRequestMetadata) request.getMetadata();
        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();

        int consolidationNumber = emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanConsolidationNumberByAccountId(request.getAccountId());
        requestMetadata.setEmpConsolidationNumber(consolidationNumber);
        setSummary(isRegulatorLed, requestPayload, requestMetadata);
        requestPayload.setEmpConsolidationNumber(consolidationNumber);
    }

    private void setSummary(boolean isRegulatorLed, EmpVariationRequestPayload requestPayload,
                            EmpVariationRequestMetadata requestMetadata) {
        if (isRegulatorLed) {
            requestMetadata.setSummary(requestPayload.getReasonRegulatorLed().getSummary());
        } else {
            requestMetadata.setSummary(requestPayload.getDetermination().getSummary());
        }
    }
}
