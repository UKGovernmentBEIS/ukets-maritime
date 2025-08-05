package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerInitiatorRequest;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerMonitoringPlanVersion;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.EmpOriginatedData;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.utils.DateUtils;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.time.LocalDate;
import java.time.Year;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerCreationRequestParamsBuilderServiceTest {

    @InjectMocks
    private AerCreationRequestParamsBuilderService creationRequestParamsBuilderService;

    @Mock
    private AerBuildEmpOriginatedDataService buildEmpOriginatedDataService;

    @Mock
    private AerBuildMonitoringPlanVersionsService buildMonitoringPlanVersionsService;

    @Test
    void buildRequestParams() {
        Long accountId = 1L;
        Year reportingYear = Year.of(2023);

        EmpOriginatedData empOriginatedData = EmpOriginatedData.builder()
            .operatorDetails(EmpOperatorDetails.builder()
                .operatorName("opename")
                .build())
            .build();
        when(buildEmpOriginatedDataService.build(accountId)).thenReturn(empOriginatedData);

        AerMonitoringPlanVersion aerMonitoringPlanVersion =
                AerMonitoringPlanVersion.builder()
                        .empId("emp1")
                        .build();
        when(buildMonitoringPlanVersionsService.build(accountId, reportingYear)).thenReturn(Optional.ofNullable(aerMonitoringPlanVersion));

        RequestParams expectedParams = RequestParams.builder()
            .type(MrtmRequestType.AER)
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .requestPayload(AerRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD)
                .empOriginatedData(empOriginatedData)
                .aerMonitoringPlanVersion(aerMonitoringPlanVersion)
                .build())
            .requestMetadata(AerRequestMetadata.builder()
                .type(MrtmRequestMetadataType.AER)
                .year(reportingYear)
                .initiatorRequest(AerInitiatorRequest.builder().requestType(MrtmRequestType.AER).build())
                .build())
            .processVars(Map.of(MrtmBpmnProcessConstants.AER_EXPIRATION_DATE,
                DateUtils.atEndOfDay(LocalDate.of(reportingYear.plusYears(1).getValue(), 3, 31))))
            .build();

        assertEquals(expectedParams, creationRequestParamsBuilderService.buildRequestParams(accountId, reportingYear));
    }

}