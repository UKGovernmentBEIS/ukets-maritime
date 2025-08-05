package uk.gov.mrtm.api.workflow.request.flow.payment.transform;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.flow.payment.RequestTypePaymentDescriptionResolver;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class MrtmRequestTypePaymentDescriptionResolver implements RequestTypePaymentDescriptionResolver {

    private final Map<String, String> cardPaymentDescriptions;

    public MrtmRequestTypePaymentDescriptionResolver() {
        super();
        cardPaymentDescriptions = new HashMap<>();
        cardPaymentDescriptions.put(MrtmRequestType.DOE, "Pay emissions determination fee");
        cardPaymentDescriptions.put(MrtmRequestType.EMP_ISSUANCE, "Pay emissions monitoring plan application fee");
        cardPaymentDescriptions.put(MrtmRequestType.EMP_VARIATION, "Pay emissions monitoring plan variation fee");
    }

    @Override
    public String resolveDescription(String requestTypeCode) {
        return Optional.ofNullable(cardPaymentDescriptions.get(requestTypeCode))
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }
}
