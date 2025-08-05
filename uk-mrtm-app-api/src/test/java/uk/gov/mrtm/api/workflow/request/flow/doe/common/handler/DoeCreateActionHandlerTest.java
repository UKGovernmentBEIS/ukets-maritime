package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerInitiatorRequest;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoeCreateActionHandlerTest {

    @InjectMocks
    private DoeCreateActionHandler handler;

    @Mock
    private RequestQueryService requestQueryService;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void process() {
        Long accountId = 1L;
        String aerRequestId = "aerRequestId";
        Year year = Year.of(2023);
        ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId(aerRequestId)
                .build();
        AppUser appUser = AppUser.builder().userId("user").build();

        LocalDateTime initiatorRequestSubmissionDate = LocalDateTime.now();
        AerInitiatorRequest initiatorRequest = AerInitiatorRequest.builder().requestType(MrtmRequestType.AER).submissionDateTime(initiatorRequestSubmissionDate).build();
        RequestDetailsDTO aerRequestDetails = new RequestDetailsDTO(aerRequestId, MrtmRequestType.AER,
                RequestStatuses.IN_PROGRESS, LocalDateTime.now(),
                AerRequestMetadata.builder().year(year).initiatorRequest(initiatorRequest).build());

        RequestParams requestParams = RequestParams.builder()
                .type(MrtmRequestType.DOE)
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestMetadata(DoeRequestMetadata.builder()
                        .type(MrtmRequestMetadataType.DOE)
                        .year(((AerRequestMetadata)aerRequestDetails.getRequestMetadata()).getYear())
                        .build())
                .requestPayload(DoeRequestPayload.builder()
                        .payloadType(MrtmRequestPayloadType.DOE_REQUEST_PAYLOAD)
                        .regulatorAssignee(appUser.getUserId())
                        .reportingYear(year)
                        .initiatorRequest(initiatorRequest)
                        .build())
                .build();

        when(requestQueryService.findRequestDetailsById(aerRequestId)).thenReturn(aerRequestDetails);
        when(startProcessRequestService.startProcess(requestParams)).thenReturn(Request.builder().id("doeId").build());

        String result = handler.process(accountId, payload, appUser);

        assertThat(result).isEqualTo("doeId");
        verify(requestQueryService, times(1)).findRequestDetailsById(aerRequestId);
        verify(startProcessRequestService, times(1)).startProcess(requestParams);
    }

    @Test
    void getRequestType() {
        assertThat(handler.getRequestType()).isEqualTo(MrtmRequestType.DOE);
    }
}
