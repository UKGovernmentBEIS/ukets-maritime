package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler.EmpPreviewCreateEmpDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.common.EmpVariationPreviewEmpDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationRequestQueryService;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.List;

@Service
public class EmpVariationRegulatorLedSubmitPreviewEmpDocumentService
        extends EmpVariationPreviewEmpDocumentService {


    public EmpVariationRegulatorLedSubmitPreviewEmpDocumentService(RequestTaskService requestTaskService,
                                                                   EmpPreviewCreateEmpDocumentService
                                                                            empPreviewCreateEmpDocumentService,
                                                                   EmissionsMonitoringPlanQueryService
                                                                                emissionsMonitoringPlanQueryService,
                                                                   EmpVariationRequestQueryService empVariationRequestQueryService,
                                                                   DateService dateService) {
        super(requestTaskService, empPreviewCreateEmpDocumentService,
            emissionsMonitoringPlanQueryService, empVariationRequestQueryService, dateService);
    }

    @Override
    public List<String> getTypes() {
        return List.of(
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_WAIT_FOR_PEER_REVIEW
        );
    }

    @Override
    public String getSummary(RequestTaskPayload requestPayload) {
        EmpVariationRegulatorLedReason reasonRegulatorLed =
            ((EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload) requestPayload).getReasonRegulatorLed();

        return reasonRegulatorLed != null
            && StringUtils.isNotBlank(reasonRegulatorLed.getSummary())
            ? reasonRegulatorLed.getSummary() : "";
    }
}
