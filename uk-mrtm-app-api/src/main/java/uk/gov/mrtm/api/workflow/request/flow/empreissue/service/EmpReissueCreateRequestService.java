package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmpReissueCreateRequestService {

    private final RequestService requestService;
    private final StartProcessRequestService startProcessRequestService;

    @Transactional
    public void createReissueRequest(Long accountId, String batchRequestId, String batchRequestBusinessKey) {
        final Request batchRequest = requestService.findRequestById(batchRequestId);
        final EmpBatchReissueRequestPayload batchRequestPayload = (EmpBatchReissueRequestPayload) batchRequest.getPayload();
        final EmpBatchReissueRequestMetadata batchRequestMetadata = (EmpBatchReissueRequestMetadata) batchRequest.getMetadata();

        final RequestParams requestParams = RequestParams.builder()
                .type(MrtmRequestType.EMP_REISSUE)
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestPayload(EmpReissueRequestPayload.builder()
                        .payloadType(MrtmRequestPayloadType.EMP_REISSUE_REQUEST_PAYLOAD)
                        .summary(batchRequestPayload.getSummary())
                        .build())
                .requestMetadata(EmpReissueRequestMetadata.builder()
                        .type(MrtmRequestMetadataType.EMP_REISSUE)
                        .batchRequestId(batchRequestId)
                        .signatory(batchRequestPayload.getSignatory())
                        .submitterId(batchRequestMetadata.getSubmitterId())
                        .submitter(batchRequestMetadata.getSubmitter())
                        .summary(batchRequestPayload.getSummary())
                        .build())
                .processVars(Map.of(
                        MrtmBpmnProcessConstants.EMP_BATCH_REQUEST_BUSINESS_KEY, batchRequestBusinessKey,
                        BpmnProcessConstants.ACCOUNT_ID, accountId
                ))
                .build();

        startProcessRequestService.startProcess(requestParams);
    }
}
