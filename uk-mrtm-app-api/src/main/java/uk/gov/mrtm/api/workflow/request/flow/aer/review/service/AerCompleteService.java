package uk.gov.mrtm.api.workflow.request.flow.aer.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.common.AerSubmitParams;
import uk.gov.mrtm.api.reporting.service.AerService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper.AerMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestVerificationService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AerCompleteService {

    private final RequestService requestService;
    private final RequestVerificationService requestVerificationService;
    private final AerService aerService;
    private final AerMapper aerMapper;

    @Transactional
    public void complete(String requestId) {
        Request request = requestService.findRequestById(requestId);
        AerRequestPayload aerRequestPayload = (AerRequestPayload) request.getPayload();
        AerRequestMetadata aerMetadata = (AerRequestMetadata) request.getMetadata();
        Long accountId = request.getAccountId();

        // refresh Verification Body details
        requestVerificationService.refreshVerificationReportVBDetails(aerRequestPayload.getVerificationReport(),
                request.getVerificationBodyId());

        AerContainer aerContainer =
                aerMapper.toAerContainer(aerRequestPayload, aerMetadata);

        //submit aer
        AerSubmitParams submitAerParams = AerSubmitParams.builder()
                .accountId(accountId)
                .aerContainer(aerContainer)
                .build();

        Optional<AerTotalReportableEmissions> reportableEmissions = aerService.submitAer(submitAerParams);

        //update metadata with reportable emissions
        reportableEmissions.ifPresent(aerMetadata::setEmissions);
    }

    @Transactional
    public void addRequestAction(String requestId, boolean skipped) {

        Request request = requestService.findRequestById(requestId);
        AerRequestPayload aerRequestPayload = (AerRequestPayload) request.getPayload();
        AerRequestMetadata aerMetadata = (AerRequestMetadata) request.getMetadata();

        // refresh Verification Body details
        requestVerificationService.refreshVerificationReportVBDetails(aerRequestPayload.getVerificationReport(),
                request.getVerificationBodyId());

        AerApplicationCompletedRequestActionPayload requestActionPayload =
                aerMapper.toAerApplicationCompletedRequestActionPayload(
                        aerRequestPayload, MrtmRequestActionPayloadType.AER_APPLICATION_COMPLETED_PAYLOAD, aerMetadata);

        String actionType = skipped ?
                MrtmRequestActionType.AER_APPLICATION_REVIEW_SKIPPED :
                MrtmRequestActionType.AER_APPLICATION_COMPLETED;

        // Add action completed
        requestService.addActionToRequest(request,
                requestActionPayload,
                actionType,
                aerRequestPayload.getRegulatorReviewer());
    }
}
