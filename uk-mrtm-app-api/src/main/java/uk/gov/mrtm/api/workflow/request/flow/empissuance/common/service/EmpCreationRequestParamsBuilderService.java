package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;

@Component
public class EmpCreationRequestParamsBuilderService {

    public RequestParams buildRequestParams(Long accountId) {
        return RequestParams.builder()
                .type(MrtmRequestType.EMP_ISSUANCE)
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestPayload(
                        EmpIssuanceRequestPayload.builder()
                                .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
                                .build()
                )
                .build();
    }
}
