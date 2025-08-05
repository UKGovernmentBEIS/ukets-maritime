package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmpReissueCreateRequestServiceTest {

    @InjectMocks
    private EmpReissueCreateRequestService cut;

    @Mock
    private RequestService requestService;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void createReissueRequest() {
        Long accountId = 1L;
        String batchRequestId = "batchRequestId";
        String batchRequestBusinessKey = "batchRequestBusinessKey";

        EmpBatchReissueRequestPayload batchRequestPayload = EmpBatchReissueRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_BATCH_REISSUE_REQUEST_PAYLOAD)
                .signatory("signatory")
                .summary("summary")
                .build();

        EmpBatchReissueRequestMetadata batchRequestMetadata = EmpBatchReissueRequestMetadata.builder()
                .submitterId("submitterId")
                .submitter("submitter")
                .summary("summary")
                .build();

        Request batchRequest = Request.builder()
                .payload(batchRequestPayload)
                .metadata(batchRequestMetadata)
                .type(RequestType.builder().code(MrtmRequestType.EMP_BATCH_REISSUE).build())
                .build();

        when(requestService.findRequestById(batchRequestId)).thenReturn(batchRequest);

        cut.createReissueRequest(accountId, batchRequestId, batchRequestBusinessKey);

        verify(requestService, times(1)).findRequestById(batchRequestId);
        verify(startProcessRequestService, times(1)).startProcess(RequestParams.builder()
                .type(MrtmRequestType.EMP_REISSUE)
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestPayload(EmpReissueRequestPayload.builder()
                        .payloadType(MrtmRequestPayloadType.EMP_REISSUE_REQUEST_PAYLOAD)
                        .summary("summary")
                        .build())
                .requestMetadata(EmpReissueRequestMetadata.builder()
                        .type(MrtmRequestMetadataType.EMP_REISSUE)
                        .batchRequestId(batchRequestId)
                        .signatory(batchRequestPayload.getSignatory())
                        .submitterId(batchRequestMetadata.getSubmitterId())
                        .submitter(batchRequestMetadata.getSubmitter())
                        .summary("summary")
                        .build())
                .processVars(Map.of(
                        MrtmBpmnProcessConstants.EMP_BATCH_REQUEST_BUSINESS_KEY, batchRequestBusinessKey,
                        BpmnProcessConstants.ACCOUNT_ID, accountId
                ))
                .build());
    }
}
