package uk.gov.mrtm.api.workflow.request.flow.doe.submit.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.mapper.DoeMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class DoeApplicationWaitForPeerReviewInitializerRequestTaskHandler implements InitializeRequestTaskHandler {

    private static final DoeMapper DOE_MAPPER = Mappers.getMapper(DoeMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        final DoeRequestPayload requestPayload = (DoeRequestPayload) request.getPayload();
        return DOE_MAPPER
                .toDoeApplicationSubmitRequestTaskPayload(
                        requestPayload, MrtmRequestTaskPayloadType.DOE_WAIT_FOR_PEER_REVIEW_PAYLOAD);
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.DOE_WAIT_FOR_PEER_REVIEW);
    }

}
