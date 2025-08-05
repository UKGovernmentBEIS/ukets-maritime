package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestAccountCreateActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class DoeCreateActionHandler implements RequestAccountCreateActionHandler<ReportRelatedRequestCreateActionPayload> {

    private final RequestQueryService requestQueryService;
    private final StartProcessRequestService startProcessRequestService;

    @Override
    public String process(Long accountId, ReportRelatedRequestCreateActionPayload payload,
                          AppUser appUser) {
        final RequestDetailsDTO aerRequestDetails = requestQueryService.findRequestDetailsById(payload.getRequestId());
        final AerRequestMetadata aerMetadata = (AerRequestMetadata) aerRequestDetails.getRequestMetadata();
        final RequestParams requestParams = RequestParams.builder()
                .type(MrtmRequestType.DOE)
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestMetadata(DoeRequestMetadata.builder()
                        .type(MrtmRequestMetadataType.DOE)
                        .year(aerMetadata.getYear())
                        .isExempted(aerMetadata.isExempted())
                        .build())
                .requestPayload(DoeRequestPayload.builder()
                        .payloadType(MrtmRequestPayloadType.DOE_REQUEST_PAYLOAD)
                        .regulatorAssignee(appUser.getUserId())
                        .reportingYear(aerMetadata.getYear())
                        .initiatorRequest(aerMetadata.getInitiatorRequest())
                        .build())
                .build();

        final Request request = startProcessRequestService.startProcess(requestParams);

        return request.getId();
    }

    @Override
    public String getRequestType() {
        return MrtmRequestType.DOE;
    }
}
