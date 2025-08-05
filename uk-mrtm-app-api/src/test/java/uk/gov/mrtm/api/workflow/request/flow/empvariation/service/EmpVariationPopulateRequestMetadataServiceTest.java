package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReasonType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmpVariationPopulateRequestMetadataServiceTest {

    @InjectMocks
    private EmpVariationPopulateRequestMetadataService cut;

    @Mock
    private RequestService requestService;

    @Mock
    private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

    @ParameterizedTest
    @MethodSource("validScenarios")
    void populateRequestMetadata(boolean isRegLed, String summary, String expectedSummary) {
        String requestId = "1";
        Long accountId = 1L;

        EmpVariationRequestMetadata requestMetadata = EmpVariationRequestMetadata.builder()
                .build();

        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
            .determination(EmpVariationDetermination.builder().summary("summary op led").build())
            .reasonRegulatorLed(EmpVariationRegulatorLedReason
                .builder()
                .type(EmpVariationRegulatorLedReasonType.FOLLOWING_IMPROVING_REPORT)
                .summary(summary)
                .build())
            .build();

        Request request = Request.builder()
                .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId))
                    .resourceType(ResourceType.ACCOUNT).build()))
                .metadata(requestMetadata)
                .payload(requestPayload)
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanConsolidationNumberByAccountId(accountId))
                .thenReturn(1);

        cut.populateRequestMetadata(requestId, isRegLed);

        assertThat(requestMetadata.getEmpConsolidationNumber()).isEqualTo(1);
        assertThat(requestPayload.getEmpConsolidationNumber()).isEqualTo(1);
        assertThat(requestMetadata.getSummary()).isEqualTo(expectedSummary);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(emissionsMonitoringPlanQueryService, times(1)).getEmissionsMonitoringPlanConsolidationNumberByAccountId(accountId);
    }

    public static Stream<Arguments> validScenarios() {
        return Stream.of(
            Arguments.of(true, "summary reg led", "summary reg led"),
            Arguments.of(false, null, "summary op led")
        );
    }

}
