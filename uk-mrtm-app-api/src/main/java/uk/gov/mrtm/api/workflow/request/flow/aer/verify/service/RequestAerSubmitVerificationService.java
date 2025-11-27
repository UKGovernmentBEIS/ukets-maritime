package uk.gov.mrtm.api.workflow.request.flow.aer.verify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.validation.AerVerificationReportValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.mapper.AerVerifyMapper;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class RequestAerSubmitVerificationService {

    private final AerVerificationReportValidatorService aerVerificationReportValidatorService;

    private final RequestService requestService;
    private final AerVerifyMapper aerVerifyMapper;

    public void submitVerificationReport(RequestTask requestTask, AppUser appUser) {
        Request request = requestTask.getRequest();
        AerApplicationVerificationSubmitRequestTaskPayload taskPayload =
                (AerApplicationVerificationSubmitRequestTaskPayload) requestTask.getPayload();

        //validate verification report
        aerVerificationReportValidatorService.validate(taskPayload.getAer(), taskPayload.getVerificationReport());

        // update request payload
        updateRequestPayload(request, taskPayload);

        // add request action
        addVerificationSubmittedRequestAction(taskPayload, request, appUser);
    }

    private void updateRequestPayload(Request request, AerApplicationVerificationSubmitRequestTaskPayload verificationSubmitRequestTaskPayload) {
        AerRequestPayload aerRequestPayload = (AerRequestPayload) request.getPayload();

        aerRequestPayload.setVerificationReport(verificationSubmitRequestTaskPayload.getVerificationReport());
        aerRequestPayload.getVerificationReport().setVerificationBodyId(request.getVerificationBodyId());
        aerRequestPayload.setVerificationPerformed(true);
        aerRequestPayload.setVerificationSectionsCompleted(verificationSubmitRequestTaskPayload.getVerificationSectionsCompleted());
        aerRequestPayload.setNotCoveredChangesProvided(verificationSubmitRequestTaskPayload.getNotCoveredChangesProvided());
    }

    private void addVerificationSubmittedRequestAction(AerApplicationVerificationSubmitRequestTaskPayload verificationSubmitRequestTaskPayload,
                                                       Request request, AppUser appUser) {

        AerApplicationSubmittedRequestActionPayload aerApplicationSubmittedPayload =
                aerVerifyMapper.toAerApplicationVerificationSubmittedRequestActionPayload(
                        verificationSubmitRequestTaskPayload,MrtmRequestActionPayloadType.AER_APPLICATION_VERIFICATION_SUBMITTED_PAYLOAD);

        requestService.addActionToRequest(
                request,
                aerApplicationSubmittedPayload,
                MrtmRequestActionType.AER_APPLICATION_VERIFICATION_SUBMITTED,
                appUser.getUserId()
        );
    }
}
