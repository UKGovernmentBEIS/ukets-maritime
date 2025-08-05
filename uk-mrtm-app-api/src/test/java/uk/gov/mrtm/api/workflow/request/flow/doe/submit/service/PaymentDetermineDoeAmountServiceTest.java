package uk.gov.mrtm.api.workflow.request.flow.doe.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeFeeDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.payment.domain.enumeration.FeeMethodType;
import uk.gov.netz.api.workflow.payment.service.PaymentFeeMethodService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentDetermineDoeAmountServiceTest {

    @InjectMocks
    private PaymentDetermineDoeAmountService paymentDetermineDreAmountService;

    @Mock
    private PaymentFeeMethodService paymentFeeMethodService;

    @Test
    void getAmount() {
        String requestId = "1";
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.WALES;
        RequestType requestType = RequestType.builder().code(MrtmRequestType.DOE).build();
        BigDecimal amount = BigDecimal.valueOf(100.00).setScale(2, RoundingMode.HALF_UP);
        Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder().resourceType(ResourceType.CA).resourceId("WALES").build()))
                .type(requestType)
                .payload(DoeRequestPayload.builder()
                        .doe(Doe.builder().maritimeEmissions(DoeMaritimeEmissions.builder()
                                        .chargeOperator(true)
                                        .feeDetails( DoeFeeDetails.builder()
                                                .hourlyRate(BigDecimal.TEN)
                                                .totalBillableHours(BigDecimal.TEN)
                                                .build())
                                        .build())
                                .build())
                        .build())
                .build();

        when(paymentFeeMethodService.getFeeMethodType(competentAuthority, requestType)).thenReturn(Optional.of(FeeMethodType.STANDARD));
        BigDecimal actualAmount = paymentDetermineDreAmountService.determineAmount(request);
        assertEquals(amount, actualAmount);
    }

    @Test
    void getAmount_fee_method_type_not_defined() {
        String requestId = "1";
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.WALES;
        RequestType requestType = RequestType.builder().code(MrtmRequestType.DOE).build();
        Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder().resourceType(ResourceType.CA).resourceId("WALES").build()))
                .type(requestType)
                .payload(DoeRequestPayload.builder()
                        .doe(Doe.builder().maritimeEmissions(DoeMaritimeEmissions.builder()
                                        .chargeOperator(true)
                                        .feeDetails( DoeFeeDetails.builder()
                                                .hourlyRate(BigDecimal.TEN)
                                                .totalBillableHours(BigDecimal.TEN)
                                                .build())
                                        .build())
                                .build())
                        .build())
                .build();

        when(paymentFeeMethodService.getFeeMethodType(competentAuthority, requestType)).thenReturn(Optional.empty());
        BigDecimal actualAmount = paymentDetermineDreAmountService.determineAmount(request);
        assertEquals(BigDecimal.ZERO, actualAmount);
    }

    @Test
    void getAmount_amount_not_set() {
        String requestId = "1";
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.WALES;
        RequestType requestType = RequestType.builder().code(MrtmRequestType.DOE).build();
        Request request = Request.builder()
                .requestResources(List.of(RequestResource.builder().resourceType(ResourceType.CA).resourceId("WALES").build()))
                .id(requestId)
                .type(requestType)
                .build();

        when(paymentFeeMethodService.getFeeMethodType(competentAuthority, requestType)).thenReturn(Optional.empty());
        BigDecimal actualAmount = paymentDetermineDreAmountService.determineAmount(request);
        assertEquals(BigDecimal.ZERO, actualAmount);
    }

    @Test
    void getRequestTypes() {
        assertEquals(MrtmRequestType.DOE, paymentDetermineDreAmountService.getRequestType());
    }
}
