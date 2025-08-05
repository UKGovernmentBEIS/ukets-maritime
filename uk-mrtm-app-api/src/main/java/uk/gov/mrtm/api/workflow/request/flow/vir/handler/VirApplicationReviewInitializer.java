package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
public class VirApplicationReviewInitializer implements InitializeRequestTaskHandler {

    @Override
    public RequestTaskPayload initializePayload(final Request request) {
        
        final VirRequestPayload requestPayload = (VirRequestPayload) request.getPayload();

        return VirApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.VIR_APPLICATION_REVIEW_PAYLOAD)
                .verificationData(requestPayload.getVerificationData())
                .operatorImprovementResponses(requestPayload.getOperatorImprovementResponses())
                .virAttachments(requestPayload.getVirAttachments())
                .build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.VIR_APPLICATION_REVIEW);
    }
}
