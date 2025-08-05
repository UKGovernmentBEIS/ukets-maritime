package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper.AerReviewMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AerApplicationAmendsSubmitInitializer implements InitializeRequestTaskHandler {

    private final AerReviewMapper reviewMapper;

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        final AerRequestPayload aerRequestPayload = (AerRequestPayload) request.getPayload();
        final AerRequestMetadata aerRequestMetadata = (AerRequestMetadata) request.getMetadata();

        return reviewMapper
            .toAerApplicationAmendsSubmitRequestTaskPayload(aerRequestPayload,
                MrtmRequestTaskPayloadType.AER_APPLICATION_AMENDS_SUBMIT_PAYLOAD,
                aerRequestMetadata.getYear());
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.AER_APPLICATION_AMENDS_SUBMIT);
    }
}
