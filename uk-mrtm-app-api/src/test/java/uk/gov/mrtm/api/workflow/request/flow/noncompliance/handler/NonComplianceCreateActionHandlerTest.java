package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestCreateActionEmptyPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonComplianceCreateActionHandlerTest {

    @InjectMocks
    private NonComplianceCreateActionHandler handler;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void process() {
        Long accountId = 1L;
        String userId = "userId";
        RequestCreateActionEmptyPayload payload = RequestCreateActionEmptyPayload.builder().build();
        AppUser appUser = AppUser.builder()
            .userId(userId)
            .build();

        RequestParams requestParams = RequestParams.builder()
            .type(MrtmRequestType.NON_COMPLIANCE)
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .requestPayload(NonComplianceRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.NON_COMPLIANCE_REQUEST_PAYLOAD)
                .regulatorAssignee(userId)
                .build())
            .build();

        when(startProcessRequestService.startProcess(requestParams)).thenReturn(Request.builder().id("1").build());

        String result = handler.process(accountId, payload, appUser);

        assertThat(result).isEqualTo("1");
        verify(startProcessRequestService).startProcess(requestParams);
        verifyNoMoreInteractions(startProcessRequestService);
    }

    @Test
    void getType() {
        assertThat(handler.getRequestType()).isEqualTo(MrtmRequestType.NON_COMPLIANCE);
    }
}
