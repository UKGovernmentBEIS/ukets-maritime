package uk.gov.mrtm.api.workflow.request.flow.doe.submit.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.mapper.DoeMapper;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class DoeApplicationSubmitInitializer implements InitializeRequestTaskHandler {
    private static final DoeMapper DOE_MAPPER = Mappers.getMapper(DoeMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        final DoeRequestPayload requestPayload = (DoeRequestPayload) request.getPayload();
        final DoeApplicationSubmitRequestTaskPayload taskPayload;
        if (doeExists(requestPayload)) {
            taskPayload = DOE_MAPPER.toDoeApplicationSubmitRequestTaskPayload(requestPayload,
                    MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD);
        } else {
            taskPayload = DoeApplicationSubmitRequestTaskPayload.builder()
                    .payloadType(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD).build();
        }
        return taskPayload;
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.DOE_APPLICATION_SUBMIT);
    }

    private boolean doeExists(DoeRequestPayload requestPayload) {
        return requestPayload.getDoe() != null;
    }

}
