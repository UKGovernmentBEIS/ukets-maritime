package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service;

import org.junit.jupiter.api.Test;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EmpCreationRequestParamsBuilderServiceTest {

    private final EmpCreationRequestParamsBuilderService requestParamsBuilderService = new EmpCreationRequestParamsBuilderService();

    @Test
    void buildRequestParams() {
        Long accountId = 1L;

        RequestParams requestParams = requestParamsBuilderService.buildRequestParams(accountId);

        assertEquals(accountId, requestParams.getAccountId());
        assertEquals(MrtmRequestType.EMP_ISSUANCE, requestParams.getType());
        assertEquals(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD, requestParams.getRequestPayload().getPayloadType());
    }

}
