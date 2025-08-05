package uk.gov.mrtm.api.workflow.request.flow.accountclosure.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureSubmitRequestTaskPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AccountClosureSubmitInitializerTest {

    @InjectMocks
    private AccountClosureSubmitInitializer initializer;

    @Test
    void initializePayload() {
        AccountClosureRequestPayload requestPayload = AccountClosureRequestPayload.builder().build();
        Request request = Request.builder().payload(requestPayload).requestResources(List.of(RequestResource.builder().resourceId("1").resourceType(ResourceType.ACCOUNT).build())).build();

        RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertThat(requestTaskPayload.getPayloadType())
                .isEqualTo(MrtmRequestTaskPayloadType.ACCOUNT_CLOSURE_SUBMIT_PAYLOAD);
        assertThat(requestTaskPayload).isInstanceOf(AccountClosureSubmitRequestTaskPayload.class);
    }

    @Test
    void getRequestTaskTypes() {
        assertEquals(initializer.getRequestTaskTypes(), Set.of(MrtmRequestTaskType.ACCOUNT_CLOSURE_SUBMIT));
    }
}
