package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerInitiatorRequest;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerMonitoringPlanVersion;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.utils.AerCustomProcessVariablesUtil;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.utils.DateUtils;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.time.LocalDate;
import java.time.Year;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AerCreationRequestParamsBuilderService {

	private final AerBuildEmpOriginatedDataService buildEmpOriginatedDataService;
    private final AerBuildMonitoringPlanVersionsService buildMonitoringPlanVersionsService;
	
    public RequestParams buildRequestParams(Long accountId, Year reportingYear) {
        Map<String, Object> processVars = AerCustomProcessVariablesUtil.buildProcessVars(reportingYear);

        return RequestParams.builder()
            .type(MrtmRequestType.AER)
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .requestPayload(AerRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD)
                .empOriginatedData(buildEmpOriginatedDataService.build(accountId))
                .aerMonitoringPlanVersion(buildMonitoringPlanVersionsService.build(accountId, reportingYear)
                        .orElse(AerMonitoringPlanVersion.builder().build()))
                .build())
            .requestMetadata(AerRequestMetadata.builder()
                .type(MrtmRequestMetadataType.AER)
                .year(reportingYear)
                .initiatorRequest(AerInitiatorRequest.builder().requestType(MrtmRequestType.AER).build())
                .build())
            .processVars(processVars)
            .build();
    }
}
