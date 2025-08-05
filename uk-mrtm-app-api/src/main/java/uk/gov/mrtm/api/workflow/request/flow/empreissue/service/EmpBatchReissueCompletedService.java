package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpEmpBatchReissueCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper.EmpBatchReissueMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

@Service
@RequiredArgsConstructor
public class EmpBatchReissueCompletedService {

    private final RequestService requestService;
    private final RequestActionUserInfoResolver requestActionUserInfoResolver;
    private static final EmpBatchReissueMapper BATCH_REISSUE_MAPPER = Mappers
            .getMapper(EmpBatchReissueMapper.class);

    @Transactional
    public void addAction(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpBatchReissueRequestPayload requestPayload = (EmpBatchReissueRequestPayload) request.getPayload();
        final EmpBatchReissueRequestMetadata requestMetadata = (EmpBatchReissueRequestMetadata) request.getMetadata();
        final String signatoryName = requestActionUserInfoResolver.getUserFullName(requestPayload.getSignatory());

        final EmpEmpBatchReissueCompletedRequestActionPayload actionPayload = BATCH_REISSUE_MAPPER
                .toCompletedActionPayload(requestPayload, requestMetadata, signatoryName,
                        MrtmRequestActionPayloadType.EMP_BATCH_REISSUE_COMPLETED_PAYLOAD);

        requestService.addActionToRequest(request,
                actionPayload,
                MrtmRequestActionType.EMP_BATCH_REISSUE_COMPLETED,
                requestMetadata.getSubmitterId());
    }
}
