package uk.gov.mrtm.api.workflow.request.flow.aer.submit.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.service.ReportableEmissionsService;
import uk.gov.mrtm.api.reporting.validation.AerValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.utils.AerEmissionsUtils;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper.AerSubmitMapper;
import uk.gov.mrtm.api.workflow.request.flow.registry.service.EmissionsUpdatedEventAddRequestActionService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RequestAerSubmitService {
    private final AerValidatorService aerValidatorService;
    private final RequestService requestService;
    private final ReportableEmissionsService reportableEmissionsService;
    private final EmissionsUpdatedEventAddRequestActionService emissionsUpdatedEventAddRequestActionService;
    private final AerSubmitMapper aerSubmitMapper;

    public void sendToVerifier(RequestTask requestTask, AppUser appUser) {
        AerApplicationSubmitRequestTaskPayload aerSubmitRequestTaskPayload =
            (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        //validate aer
        AerContainer aerContainer = aerSubmitMapper
            .toAerContainer(aerSubmitRequestTaskPayload);
        aerValidatorService.validateAer(aerContainer, requestTask.getRequest().getAccountId());

        //update request payload
        Request request = requestTask.getRequest();
        AerRequestPayload aerRequestPayload = (AerRequestPayload) request.getPayload();

        updateAerRequestPayload(aerRequestPayload, aerSubmitRequestTaskPayload);

        //add request action
        addApplicationSubmittedRequestAction(
            aerSubmitRequestTaskPayload,
            request,
            appUser,
            MrtmRequestActionType.AER_APPLICATION_SENT_TO_VERIFIER
        );
    }

    public void sendToRegulator(RequestTask requestTask, AppUser appUser) {
        Request request = requestTask.getRequest();
        AerRequestPayload requestPayload = (AerRequestPayload) request.getPayload();

        AerApplicationSubmitRequestTaskPayload aerSubmitRequestTaskPayload =
            (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        // Delete verificationReport if verificationPerformed = false as in this case verification report is obsolete.
        if (!aerSubmitRequestTaskPayload.isVerificationPerformed()) {
        	requestPayload.setVerificationReport(null);
        }

        //validate
        AerContainer aerContainer = aerSubmitMapper.toAerContainer(aerSubmitRequestTaskPayload, requestPayload.getVerificationReport());
        aerValidatorService.validate(aerContainer, requestTask.getRequest().getAccountId());

        //update request payload
        updateAerRequestPayload(requestPayload, aerSubmitRequestTaskPayload);

        //add request action
        addApplicationSubmittedRequestAction(
            aerSubmitRequestTaskPayload,
            request,
            appUser,
            MrtmRequestActionType.AER_APPLICATION_SUBMITTED
        );

        //update request metadata with reportable emissions
        if(Boolean.TRUE.equals(aerContainer.getReportingRequired())) {
            updateReportableEmissionsAndRequestMetadata(request, aerContainer, appUser.getUserId());
        }
    }

    private void updateAerRequestPayload(AerRequestPayload aerRequestPayload,
                                         AerApplicationSubmitRequestTaskPayload aerApplicationSubmitRequestTaskPayload) {
        aerRequestPayload.setReportingRequired(aerApplicationSubmitRequestTaskPayload.getReportingRequired());
        aerRequestPayload.setReportingObligationDetails(aerApplicationSubmitRequestTaskPayload.getReportingObligationDetails());
        aerRequestPayload.setAer(aerApplicationSubmitRequestTaskPayload.getAer());
        aerRequestPayload.setAerAttachments(aerApplicationSubmitRequestTaskPayload.getAerAttachments());
        aerRequestPayload.setVerificationPerformed(aerApplicationSubmitRequestTaskPayload.isVerificationPerformed());
        aerRequestPayload.setAerMonitoringPlanVersion(aerApplicationSubmitRequestTaskPayload.getAerMonitoringPlanVersion());
        aerRequestPayload.setEmpOriginatedData(aerApplicationSubmitRequestTaskPayload.getEmpOriginatedData());
        aerRequestPayload.setAerSubmitSectionsCompleted(aerApplicationSubmitRequestTaskPayload.getAerSectionsCompleted());

        if (Boolean.TRUE.equals(aerApplicationSubmitRequestTaskPayload.getReportingRequired())) {
            aerRequestPayload.setTotalEmissions(
                AerEmissionsUtils.getAerTotalReportableEmissions(aerApplicationSubmitRequestTaskPayload.getAer().getTotalEmissions()));
        }
    }

    private void addApplicationSubmittedRequestAction(AerApplicationSubmitRequestTaskPayload aerSubmitRequestTaskPayload,
                                                      Request request, AppUser appUser, String requestActionType) {

        AerApplicationSubmittedRequestActionPayload aerApplicationSubmittedPayload =
            aerSubmitMapper.toAerApplicationSubmittedRequestActionPayload(
                aerSubmitRequestTaskPayload, MrtmRequestActionPayloadType.AER_APPLICATION_SUBMITTED_PAYLOAD);

        if (aerSubmitRequestTaskPayload.isVerificationPerformed()) {
            aerApplicationSubmittedPayload.setVerificationReport(((AerRequestPayload) request.getPayload()).getVerificationReport());
        }
        requestService.addActionToRequest(request, aerApplicationSubmittedPayload, requestActionType, appUser.getUserId());
    }

    private void updateReportableEmissionsAndRequestMetadata(Request request, AerContainer aerContainer, String userId) {
        AerTotalReportableEmissions totalReportableEmissions =
            reportableEmissionsService.calculateTotalReportableEmissions(aerContainer);
        ReportableEmissionsUpdatedSubmittedEventDetails eventDetails = reportableEmissionsService.updateReportableEmissions(
            totalReportableEmissions, aerContainer.getReportingYear(), request.getAccountId(), false);

        emissionsUpdatedEventAddRequestActionService.addRequestAction(request, eventDetails, userId);

        AerRequestMetadata metadata = (AerRequestMetadata) request.getMetadata();
        metadata.setEmissions(totalReportableEmissions);

        Optional.ofNullable(aerContainer.getVerificationReport()).ifPresent(report ->
            metadata.setOverallAssessmentType(report.getVerificationData().getOverallDecision().getType()));
    }
}
