package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpEmpBatchReissueCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpEmpReissueAccountReport;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.Map;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpBatchEmpReissueCompletedServiceTest {

    @InjectMocks
    private EmpBatchReissueCompletedService cut;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestActionUserInfoResolver requestActionUserInfoResolver;

    @Test
    void addAction() {
        String requestId = "1";
        EmpBatchReissueRequestPayload requestPayload = EmpBatchReissueRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_BATCH_REISSUE_REQUEST_PAYLOAD)
                .signatory("signatory")
                .build();
        EmpBatchReissueRequestMetadata requestMetadata = EmpBatchReissueRequestMetadata.builder()
                .submitterId("submitterId")
                .submitter("submitter")
                .accountsReports(Map.of(1L, EmpEmpReissueAccountReport.builder()
                        .build()))
                .build();

        Request request = Request.builder()
                .payload(requestPayload)
                .metadata(requestMetadata)
                .type(RequestType.builder().resourceType(MrtmRequestType.EMP_BATCH_REISSUE).build())
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestActionUserInfoResolver.getUserFullName("signatory")).thenReturn("signatoryFullname");

        cut.addAction(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestActionUserInfoResolver, times(1)).getUserFullName("signatory");
        verify(requestService, times(1)).addActionToRequest(request,
                EmpEmpBatchReissueCompletedRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.EMP_BATCH_REISSUE_COMPLETED_PAYLOAD)
                        .submitter("submitter")
                        .signatory("signatory")
                        .signatoryName("signatoryFullname")
                        .numberOfAccounts(1)
                        .build(),
                MrtmRequestActionType.EMP_BATCH_REISSUE_COMPLETED, "submitterId");
    }
}
