package uk.gov.mrtm.api.workflow.request.flow.doe.submit.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.netz.api.workflow.payment.domain.enumeration.FeeMethodType;
import uk.gov.netz.api.workflow.payment.service.PaymentFeeMethodService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.payment.service.PaymentDetermineAmountByRequestTypeService;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentDetermineDoeAmountService implements PaymentDetermineAmountByRequestTypeService {
    private final PaymentFeeMethodService paymentFeeMethodService;

    @Override
    public BigDecimal determineAmount(Request request) {
        final Optional<FeeMethodType> feeMethodType = paymentFeeMethodService.getFeeMethodType(request.getCompetentAuthority(), request.getType());
        return feeMethodType.map(type -> {
                    DoeRequestPayload requestPayload = (DoeRequestPayload) request.getPayload();
                    return requestPayload.getDoe().getMaritimeEmissions().getFeeAmount();
                })
                .orElse(BigDecimal.ZERO);
    }

    @Override
    public String getRequestType() {
        return MrtmRequestType.DOE;
    }
}
