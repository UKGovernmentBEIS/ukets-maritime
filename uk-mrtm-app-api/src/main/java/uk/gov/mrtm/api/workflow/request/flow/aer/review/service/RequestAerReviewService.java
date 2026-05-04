package uk.gov.mrtm.api.workflow.request.flow.aer.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.service.ReportableEmissionsService;
import uk.gov.mrtm.api.reporting.validation.AerValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDataType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerVerificationReportDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerVerificationReportDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.utils.AerEmissionsUtils;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.utils.AerReviewUtils;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationSkipReviewRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerSaveReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper.AerReviewMapper;
import uk.gov.mrtm.api.workflow.request.flow.registry.service.EmissionsUpdatedEventAddRequestActionService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestAerReviewService {

    private final AerReviewMapper aerReviewMapper;
    private final RequestService requestService;
    private final AerValidatorService aerValidatorService;
    private final ReportableEmissionsService reportableEmissionsService;
    private final EmissionsUpdatedEventAddRequestActionService emissionsUpdatedEventAddRequestActionService;

    @Transactional
    public void saveReviewGroupDecision(AerSaveReviewGroupDecisionRequestTaskActionPayload taskActionPayload,
                                        RequestTask requestTask) {

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                (AerApplicationReviewRequestTaskPayload) requestTask.getPayload();
        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = reviewRequestTaskPayload.getReviewGroupDecisions();

        reviewGroupDecisions.put(taskActionPayload.getGroup(), taskActionPayload.getDecision());

        reviewRequestTaskPayload.setAerSectionsCompleted(taskActionPayload.getSectionsCompleted());
    }

    @Transactional
    public void updateRequestPayloadWithReviewOutcome(RequestTask requestTask, AppUser appUser) {
        AerApplicationReviewRequestTaskPayload requestTaskPayload =
                (AerApplicationReviewRequestTaskPayload) requestTask.getPayload();
        Request request = requestTask.getRequest();
        AerRequestPayload requestPayload = (AerRequestPayload) request.getPayload();

        requestPayload.setRegulatorReviewer(appUser.getUserId());
        requestPayload.setReviewGroupDecisions(requestTaskPayload.getReviewGroupDecisions());
        requestPayload.setReviewAttachments(requestTaskPayload.getReviewAttachments());
        requestPayload.setAerReviewSectionsCompleted(requestTaskPayload.getAerSectionsCompleted());
    }

    // This is used to remove the "Changes requested by the regulator" subtask status when re-initiating the amends task.
    public void removeAmendRequestedChangesSubtaskStatus(AerRequestPayload requestTaskPayload) {
        requestTaskPayload.getAerSubmitSectionsCompleted().keySet().removeIf(entry -> entry.equals("amendRequestedChanges"));
    }

    @Transactional
    public void sendAmendedAerToVerifier(RequestTask requestTask, AppUser appUser) {
        Request request = requestTask.getRequest();

        AerRequestPayload requestPayload = (AerRequestPayload) request.getPayload();
        final AerApplicationAmendsSubmitRequestTaskPayload amendsSubmitRequestTaskPayload =
            (AerApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();

        //validate aer
        AerContainer aerContainer = aerReviewMapper
            .toAerContainer(amendsSubmitRequestTaskPayload);
        aerValidatorService.validateAer(aerContainer, requestTask.getRequest().getAccountId());

        //update request payload
        updateAerRequestPayload(requestPayload, amendsSubmitRequestTaskPayload);

        //add request action
        addApplicationSubmittedRequestAction(amendsSubmitRequestTaskPayload,
            request,
            appUser,
            MrtmRequestActionType.AER_APPLICATION_AMENDS_SENT_TO_VERIFIER
        );
    }

    @Transactional
    public void sendAmendedAerToRegulator(RequestTask requestTask, AppUser appUser) {
        Request request = requestTask.getRequest();
        AerRequestPayload requestPayload = (AerRequestPayload) request.getPayload();
        final AerApplicationAmendsSubmitRequestTaskPayload amendsSubmitRequestTaskPayload =
            (AerApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();

        //Delete verificationReport and verification review decisions if verificationPerformed = false as in this case verification report is obsolete.
        if (!amendsSubmitRequestTaskPayload.isVerificationPerformed()) {
            requestPayload.setVerificationReport(null);
            cleanUpVerificationDataReviewGroupDecisionsFromRequestPayload(requestPayload);
        }

        //validate aer
        AerContainer aerContainer = aerReviewMapper
            .toAerContainer(amendsSubmitRequestTaskPayload, requestPayload.getVerificationReport());
        aerValidatorService.validate(aerContainer, request.getAccountId());

        //update request payload
        updateAerRequestPayload(requestPayload, amendsSubmitRequestTaskPayload);

        //add request action
        addApplicationSubmittedRequestAction(amendsSubmitRequestTaskPayload,
            request,
            appUser,
            MrtmRequestActionType.AER_APPLICATION_AMENDS_SUBMITTED
        );

        //update request metadata with reportable emissions
        if(Boolean.TRUE.equals(amendsSubmitRequestTaskPayload.getReportingRequired())) {
            updateReportableEmissionsAndRequestMetadata(request, aerContainer, appUser.getUserId());
        } else {
            deleteReportableAndRequestMetadataEmissions(request, aerContainer);
        }
    }

    @Transactional
    public void updateRequestPayloadWithSkipReviewOutcome(
            final RequestTask requestTask,
            final AerApplicationSkipReviewRequestTaskActionPayload payload,
            final AppUser appUser) {

        final Request request = requestTask.getRequest();
        final AerRequestPayload requestPayload = (AerRequestPayload) request.getPayload();

        final boolean isVerificationPerformed = requestPayload.isVerificationPerformed();
        boolean hasPorts = requestPayload.getAer() != null
            && requestPayload.getAer().getPortEmissions() != null
            && !requestPayload.getAer().getPortEmissions().getPorts().isEmpty();
        boolean hasVoyages = requestPayload.getAer() != null
            && requestPayload.getAer().getVoyageEmissions() != null
            && !requestPayload.getAer().getVoyageEmissions().getVoyages().isEmpty();
        boolean smfExist = requestPayload.getAer() != null
            && requestPayload.getAer().getSmf().getExist();

        final Set<AerReviewGroup> aerDataReviewGroups = AerReviewGroup
            .getAerDataReviewGroups(requestPayload.getReportingRequired(), hasPorts, hasVoyages);
        final Set<AerReviewGroup> verificationDataReviewGroups = isVerificationPerformed ?
                AerReviewGroup.getVerificationReportDataReviewGroups(smfExist) :
                Collections.emptySet() ;

        final Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = requestPayload.getReviewGroupDecisions();

        for (final AerReviewGroup group : aerDataReviewGroups) {
            final AerDataReviewDecision decision = AerDataReviewDecision.builder()
                    .reviewDataType(AerReviewDataType.AER_DATA)
                    .type(AerDataReviewDecisionType.ACCEPTED)
                    .details(ReviewDecisionDetails.builder().build())
                    .build();
            reviewGroupDecisions.put(group, decision);
        }

        for (final AerReviewGroup group : verificationDataReviewGroups) {
            final AerVerificationReportDataReviewDecision decision = AerVerificationReportDataReviewDecision.builder()
                    .reviewDataType(AerReviewDataType.VERIFICATION_REPORT_DATA)
                    .type(AerVerificationReportDataReviewDecisionType.ACCEPTED)
                    .details(ReviewDecisionDetails.builder().build())
                    .build();
            reviewGroupDecisions.put(group, decision);
        }

        requestPayload.setAerSkipReviewDecision(payload.getAerSkipReviewDecision());
        requestPayload.setRegulatorReviewer(appUser.getUserId());
    }

    private void updateAerRequestPayload(AerRequestPayload aerRequestPayload,
                                         AerApplicationAmendsSubmitRequestTaskPayload aerApplicationAmendsSubmitRequestTaskPayload) {
        cleanUpDeprecatedAerDataReviewGroupDecisionsFromRequestPayload(aerRequestPayload, aerApplicationAmendsSubmitRequestTaskPayload);

        aerRequestPayload.setReportingRequired(aerApplicationAmendsSubmitRequestTaskPayload.getReportingRequired());
        aerRequestPayload.setReportingObligationDetails(aerApplicationAmendsSubmitRequestTaskPayload.getReportingObligationDetails());
        aerRequestPayload.setAer(aerApplicationAmendsSubmitRequestTaskPayload.getAer());
        aerRequestPayload.setAerAttachments(aerApplicationAmendsSubmitRequestTaskPayload.getAerAttachments());
        aerRequestPayload.setVerificationPerformed(aerApplicationAmendsSubmitRequestTaskPayload.isVerificationPerformed());
        aerRequestPayload.setAerMonitoringPlanVersion(aerApplicationAmendsSubmitRequestTaskPayload.getAerMonitoringPlanVersion());
        aerRequestPayload.setAerSubmitSectionsCompleted(aerApplicationAmendsSubmitRequestTaskPayload.getAerSectionsCompleted());

        if (Boolean.TRUE.equals(aerApplicationAmendsSubmitRequestTaskPayload.getReportingRequired())) {
            aerRequestPayload.setTotalEmissions(
                AerEmissionsUtils.getAerTotalReportableEmissions(aerApplicationAmendsSubmitRequestTaskPayload.getAer().getTotalEmissions()));
        }
    }

    private void cleanUpDeprecatedAerDataReviewGroupDecisionsFromRequestPayload(AerRequestPayload requestPayload,
                                                                                AerApplicationAmendsSubmitRequestTaskPayload amendsSubmitRequestTaskPayload) {
        Set<AerReviewGroup> deprecatedAerDataReviewGroups =
            AerReviewUtils.getDeprecatedAerDataReviewGroups(requestPayload, amendsSubmitRequestTaskPayload);

        if (!deprecatedAerDataReviewGroups.isEmpty()) {
            requestPayload.getReviewGroupDecisions().keySet().removeAll(deprecatedAerDataReviewGroups);
        }
    }

    private void addApplicationSubmittedRequestAction(AerApplicationAmendsSubmitRequestTaskPayload aerAmendsSubmitRequestTaskPayload,
                                                      Request request, AppUser appUser, String requestActionType) {
        AerApplicationSubmittedRequestActionPayload aerApplicationSubmittedPayload =
            aerReviewMapper.toAerApplicationSubmittedRequestActionPayload(
                aerAmendsSubmitRequestTaskPayload, MrtmRequestActionPayloadType.AER_APPLICATION_AMENDS_SUBMITTED_PAYLOAD);
        if (aerAmendsSubmitRequestTaskPayload.isVerificationPerformed()) {
            aerApplicationSubmittedPayload.setVerificationReport(((AerRequestPayload) request.getPayload()).getVerificationReport());
        }
        requestService.addActionToRequest(request, aerApplicationSubmittedPayload, requestActionType, appUser.getUserId());
    }

    private void cleanUpVerificationDataReviewGroupDecisionsFromRequestPayload(AerRequestPayload requestPayload) {
        Map<AerReviewGroup, AerReviewDecision> verificationDataReviewGroupDecisions = requestPayload.getReviewGroupDecisions().entrySet().stream()
            .filter(entry -> entry.getValue().getReviewDataType() == AerReviewDataType.VERIFICATION_REPORT_DATA)
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        requestPayload.getReviewGroupDecisions()
            .keySet()
            .removeAll(verificationDataReviewGroupDecisions.keySet());
    }

    private void updateReportableEmissionsAndRequestMetadata(Request request, AerContainer aerContainer, String userId) {
        AerTotalReportableEmissions totalReportableEmissions = reportableEmissionsService.calculateTotalReportableEmissions(aerContainer);
        ReportableEmissionsUpdatedSubmittedEventDetails eventDetails = reportableEmissionsService
            .updateReportableEmissions(totalReportableEmissions, aerContainer.getReportingYear(), request.getAccountId(), false);

        emissionsUpdatedEventAddRequestActionService.addRequestAction(request, eventDetails, userId);

        AerRequestMetadata metadata = (AerRequestMetadata) request.getMetadata();
        metadata.setEmissions(totalReportableEmissions);

        Optional.ofNullable(aerContainer.getVerificationReport()).ifPresent(report ->
            metadata.setOverallAssessmentType(report.getVerificationData().getOverallDecision().getType()));
    }

    private void deleteReportableAndRequestMetadataEmissions(Request request, AerContainer aerContainer) {
        reportableEmissionsService.deleteReportableEmissions(request.getAccountId(), aerContainer.getReportingYear());
        AerRequestMetadata metadata = (AerRequestMetadata) request.getMetadata();
        metadata.setEmissions(null);
        metadata.setOverallAssessmentType(null);
    }

}
