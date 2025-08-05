package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper.AerReviewMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestVerificationService;

@Service
@RequiredArgsConstructor
public abstract class AerReviewInitializer implements InitializeRequestTaskHandler {

    private final RequestVerificationService requestVerificationService;
    private final AerReviewMapper aerReviewMapper;

    protected abstract String getRequestTaskPayloadType();

    @Override
    public RequestTaskPayload initializePayload(Request request) {

        AerRequestPayload aerRequestPayload = (AerRequestPayload) request.getPayload();
        AerRequestMetadata aerRequestMetadata = (AerRequestMetadata) request.getMetadata();

        // refresh Verification Body details
        requestVerificationService.refreshVerificationReportVBDetails(aerRequestPayload.getVerificationReport(),
                request.getVerificationBodyId());

        return aerReviewMapper.toAerApplicationReviewRequestTaskPayload(
                aerRequestPayload,
                getRequestTaskPayloadType(),
                aerRequestMetadata.getYear()
        );
    }
}
