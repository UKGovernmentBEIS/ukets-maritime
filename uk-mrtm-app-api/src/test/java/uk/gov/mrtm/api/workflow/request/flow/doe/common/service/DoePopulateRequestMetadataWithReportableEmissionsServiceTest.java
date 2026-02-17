package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReason;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeFeeDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeTotalMaritimeEmissions;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoePopulateRequestMetadataWithReportableEmissionsServiceTest {

    @InjectMocks
    private DoePopulateRequestMetadataWithReportableEmissionsService service;

    @Mock
    private RequestService requestService;

    @Test
    void updateRequestMetadata() {
        String requestId = "1";
        Request request = Request.builder()
            .payload(DoeRequestPayload.builder()
                .doe(
                    Doe.builder().maritimeEmissions(
                            DoeMaritimeEmissions.builder()
                                    .totalMaritimeEmissions(
                                            DoeTotalMaritimeEmissions.builder()
                                                    .surrenderEmissions(BigDecimal.valueOf(10000))
                                                    .calculationApproach("calculationApproach")
                                                    .build())
                                    .chargeOperator(false)
                                    .feeDetails(DoeFeeDetails.builder().build())
                                    .determinationReason(
                                        DoeDeterminationReason.builder()
                                            .details(DoeDeterminationReasonDetails.builder()
                                                .type(DoeDeterminationReasonType.IMPOSING_OR_CONSIDERING_IMPOSING_CIVIL_PENALTY_IN_ACCORDANCE_WITH_ORDER)
                                                .noticeText("noticeText")
                                                .build())
                                            .furtherDetails("furtherDetails")
                                            .build())
                                    .build())


                    .build())
                .build())
            .metadata(DoeRequestMetadata.builder().build())
            .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        service.updateRequestMetadata(requestId);

        verify(requestService, times(1)).findRequestById(requestId);

        assertThat(((DoeRequestMetadata) request.getMetadata()).getEmissions().getSurrenderEmissions())
            .isEqualTo(((DoeRequestPayload) request.getPayload()).getDoe().getMaritimeEmissions()
                    .getTotalMaritimeEmissions().getSurrenderEmissions());
    }
}
