package uk.gov.mrtm.api.workflow.request.flow.aer.review.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerReportingObligationDetails;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortEmissions;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.totalemissions.AerTotalEmissions;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationDecisionType;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifiedSatisfactoryDecision;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyage;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageEmissions;
import uk.gov.mrtm.api.reporting.service.ReportableEmissionsService;
import uk.gov.mrtm.api.reporting.validation.AerValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerMonitoringPlanVersion;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDataType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerVerificationReportDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerVerificationReportDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationSkipReviewRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerSaveReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerSkipReviewActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerSkipReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper.AerReviewMapper;
import uk.gov.mrtm.api.workflow.request.flow.registry.service.SendRegistryUpdatedEventAddRequestActionService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.math.BigDecimal;
import java.time.Year;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestAerReviewServiceTest {

    @InjectMocks
    private RequestAerReviewService reviewService;

    @Mock
    private AerReviewMapper aerReviewMapper;

    @Mock
    private AerValidatorService aerValidatorService;

    @Mock
    private RequestService requestService;

    @Mock
    private ReportableEmissionsService reportableEmissionsService;

    @Mock
    private SendRegistryUpdatedEventAddRequestActionService sendRegistryUpdatedEventAddRequestActionService;

    @Test
    void saveReviewGroupDecision() {
        AerDataReviewDecision acceptedDecision = AerDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.VERIFICATION_REPORT_DATA)
                .type(AerDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();
        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                AerApplicationReviewRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_REVIEW_PAYLOAD)
                        .reviewGroupDecisions(new HashMap<>(Map.of(AerReviewGroup.LIST_OF_SHIPS, acceptedDecision)))
                        .aerSectionsCompleted(Map.of("section_a", "completed"))
                        .build();

        RequestTask requestTask = RequestTask.builder()
                .payload(reviewRequestTaskPayload)
                .build();

        AerDataReviewDecision amendsDecision = AerDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.AER_DATA)
                .type(AerDataReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ChangesRequiredDecisionDetails.builder()
                        .requiredChanges(List.of(ReviewDecisionRequiredChange.builder().reason("reason").build()))
                        .notes("decision notes")
                        .build())
                .build();

        AerSaveReviewGroupDecisionRequestTaskActionPayload taskActionPayload =
                AerSaveReviewGroupDecisionRequestTaskActionPayload.builder()
                        .group(AerReviewGroup.OPERATOR_DETAILS)
                        .decision(amendsDecision)
                        .sectionsCompleted(Map.of("section_a", "completed", "section_b", "completed"))
                        .build();

        // invoke
        reviewService.saveReviewGroupDecision(taskActionPayload, requestTask);

        // verify
        assertThat(requestTask.getPayload()).isInstanceOf(AerApplicationReviewRequestTaskPayload.class);

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayloadSaved =
                (AerApplicationReviewRequestTaskPayload) requestTask.getPayload();

        assertThat(reviewRequestTaskPayloadSaved.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(Map.of(
                AerReviewGroup.LIST_OF_SHIPS, acceptedDecision,
                AerReviewGroup.OPERATOR_DETAILS, amendsDecision));
        assertThat(reviewRequestTaskPayloadSaved.getAerSectionsCompleted())
                .containsExactlyInAnyOrderEntriesOf(taskActionPayload.getSectionsCompleted());
    }

    @Test
    void removeAmendRequestedChangesSubtaskStatus() {
        Map<String, String> sectionsCompleted = new HashMap<>();
        sectionsCompleted.put("section_a", "completed");
        sectionsCompleted.put("amendRequestedChanges", "completed");

        AerRequestPayload payload = AerRequestPayload.builder()
            .aerSubmitSectionsCompleted(sectionsCompleted)
            .build();

        reviewService.removeAmendRequestedChangesSubtaskStatus(payload);

        assertThat(payload.getAerSubmitSectionsCompleted())
            .containsExactlyInAnyOrderEntriesOf(Map.of("section_a", "completed"));
    }

    @Test
    void updateRequestPayloadWithReviewOutcome() {
        String userId = "userId";
        AppUser user = AppUser.builder().userId(userId).build();

        AerDataReviewDecision acceptedDecision = AerDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.VERIFICATION_REPORT_DATA)
                .type(AerDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();
        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = Map.of(
                AerReviewGroup.LIST_OF_SHIPS, acceptedDecision,
                AerReviewGroup.OPERATOR_DETAILS, acceptedDecision
        );
        Map<String, String> reviewSectionsCompleted = Map.of(
                "listOfShips", "completed",
                "operatorDetails", "completed");
        Map<UUID, String> reviewAttachments = Map.of(UUID.randomUUID(), "attachment1");
        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                AerApplicationReviewRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_REVIEW_PAYLOAD)
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .aerSectionsCompleted(reviewSectionsCompleted)
                        .reviewAttachments(reviewAttachments)
                        .build();

        AerRequestPayload requestPayload = AerRequestPayload.builder().build();
        Request request = Request.builder().payload(requestPayload).build();
        RequestTask requestTask = RequestTask.builder()
                .payload(reviewRequestTaskPayload)
                .request(request)
                .build();

        //invoke
        reviewService.updateRequestPayloadWithReviewOutcome(requestTask, user);

        //verify
        AerRequestPayload updatedRequestPayload =
                (AerRequestPayload) request.getPayload();

        assertEquals(userId, updatedRequestPayload.getRegulatorReviewer());
        assertThat(updatedRequestPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(reviewGroupDecisions);
        assertThat(updatedRequestPayload.getAerReviewSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(reviewSectionsCompleted);
        assertThat(updatedRequestPayload.getAerSubmitSectionsCompleted()).isEmpty();
        assertThat(updatedRequestPayload.getReviewAttachments()).containsExactlyInAnyOrderEntriesOf(reviewAttachments);
    }

    @ParameterizedTest
    @MethodSource("sendAmendedAerToVerifierScenarios")
    void sendAmendedAerToVerifier(boolean requestTaskReportingRequired, boolean requestReportingRequired,
                                  boolean isVerificationPerformed,
                                  int setVerificationReportInvocations,
                                  Map<AerReviewGroup, AerReviewDecision> requestPayloadReviewGroupDecisions,
                                  Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions) {
        long accountId = 1L;
        String userId = UUID.randomUUID().toString();
        AppUser user = AppUser.builder().userId(userId).build();
        AerTotalEmissions totalEmissions = AerTotalEmissions.builder()
            .totalShipEmissionsSummary(new BigDecimal("1"))
            .surrenderEmissionsSummary(new BigDecimal("2"))
            .lessVoyagesInNorthernIrelandDeduction(AerPortEmissionsMeasurement.builder().total(new BigDecimal("3")).build())
            .build();

        Aer aer = Aer.builder().totalEmissions(totalEmissions)
            .portEmissions(AerPortEmissions.builder().ports(Set.of(AerPort.builder().build())).build())
            .voyageEmissions(AerVoyageEmissions.builder().voyages(Set.of(AerVoyage.builder().build())).build())
            .build();
        Map<String, String> sectionsCompleted = Map.of("section_a", "completed", "section_b", "completed");
        AerReportingObligationDetails reportingObligationDetails = AerReportingObligationDetails.builder().build();
        Map<UUID, String> aerAttachments = Map.of(UUID.randomUUID(), "file");
        AerTotalReportableEmissions totalReportableEmissions = AerTotalReportableEmissions.builder()
            .totalEmissions(new BigDecimal("1"))
            .surrenderEmissions(new BigDecimal("2"))
            .lessVoyagesInNorthernIrelandDeduction(new BigDecimal("3"))
            .build();

        AerVerificationReport verificationReport = AerVerificationReport.builder().build();
        AerRequestPayload requestPayload = AerRequestPayload.builder()
            .reportingRequired(requestReportingRequired)
            .aer(aer)
            .reviewGroupDecisions(requestPayloadReviewGroupDecisions)
            .verificationReport(verificationReport)
            .build();

        AerRequestPayload expectedRequestPayload = AerRequestPayload.builder()
            .reportingRequired(requestTaskReportingRequired)
            .verificationReport(verificationReport)
            .totalEmissions(requestTaskReportingRequired ? totalReportableEmissions : null)
            .reportingObligationDetails(reportingObligationDetails)
            .aer(aer)
            .aerAttachments(aerAttachments)
            .verificationPerformed(isVerificationPerformed)
            .aerMonitoringPlanVersion(AerMonitoringPlanVersion.builder().build())
            .reviewGroupDecisions(reviewGroupDecisions)
            .aerSubmitSectionsCompleted(sectionsCompleted)
            .build();

        final Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .payload(requestPayload)
            .build();

        AerApplicationAmendsSubmitRequestTaskPayload requestTaskPayload =
            AerApplicationAmendsSubmitRequestTaskPayload.builder()
                .reportingRequired(requestTaskReportingRequired)
                .reportingObligationDetails(reportingObligationDetails)
                .aer(aer)
                .aerAttachments(aerAttachments)
                .verificationPerformed(isVerificationPerformed)
                .aerMonitoringPlanVersion(AerMonitoringPlanVersion.builder().build())
                .aerSectionsCompleted(sectionsCompleted)
                .build();

        AerContainer aerContainer = mock(AerContainer.class);

        final RequestTask requestTask = RequestTask.builder()
            .request(request)
            .payload(requestTaskPayload)
            .build();
        when(aerReviewMapper.toAerContainer(requestTaskPayload)).thenReturn(aerContainer);
        AerApplicationSubmittedRequestActionPayload requestActionPayload = mock(AerApplicationSubmittedRequestActionPayload.class);
        when(aerReviewMapper.toAerApplicationSubmittedRequestActionPayload(requestTaskPayload,
            MrtmRequestActionPayloadType.AER_APPLICATION_AMENDS_SUBMITTED_PAYLOAD)).thenReturn(requestActionPayload);

        reviewService.sendAmendedAerToVerifier(requestTask, user);

        assertEquals(expectedRequestPayload, request.getPayload());

        verify(aerReviewMapper).toAerContainer(requestTaskPayload);
        verify(aerReviewMapper)
            .toAerApplicationSubmittedRequestActionPayload(requestTaskPayload, MrtmRequestActionPayloadType.AER_APPLICATION_AMENDS_SUBMITTED_PAYLOAD);
        verify(aerValidatorService).validateAer(aerContainer, accountId);
        verify(requestService).addActionToRequest(request, requestActionPayload, MrtmRequestActionType.AER_APPLICATION_AMENDS_SENT_TO_VERIFIER, userId);
        verify(requestActionPayload, times(setVerificationReportInvocations)).setVerificationReport(verificationReport);
        verifyNoMoreInteractions(aerReviewMapper, aerValidatorService, requestService, requestActionPayload);
    }

    private static Stream<Arguments> sendAmendedAerToVerifierScenarios() {
        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisionsWhenReportingRequired = new HashMap<>();
        reviewGroupDecisionsWhenReportingRequired.put(AerReviewGroup.OPERATOR_DETAILS, AerDataReviewDecision.builder().build());
        reviewGroupDecisionsWhenReportingRequired.put(AerReviewGroup.MONITORING_PLAN_CHANGES, AerDataReviewDecision.builder().build());
        reviewGroupDecisionsWhenReportingRequired.put(AerReviewGroup.LIST_OF_SHIPS, AerDataReviewDecision.builder().build());
        reviewGroupDecisionsWhenReportingRequired.put(AerReviewGroup.VOYAGES, AerDataReviewDecision.builder().build());
        reviewGroupDecisionsWhenReportingRequired.put(AerReviewGroup.PORTS, AerDataReviewDecision.builder().build());
        reviewGroupDecisionsWhenReportingRequired.put(AerReviewGroup.AGGREGATED_EMISSIONS_DATA, AerDataReviewDecision.builder().build());
        reviewGroupDecisionsWhenReportingRequired.put(AerReviewGroup.EMISSIONS_REDUCTION_CLAIM, AerDataReviewDecision.builder().build());
        reviewGroupDecisionsWhenReportingRequired.put(AerReviewGroup.TOTAL_EMISSIONS, AerDataReviewDecision.builder().build());
        reviewGroupDecisionsWhenReportingRequired.put(AerReviewGroup.ADDITIONAL_DOCUMENTS, AerDataReviewDecision.builder().build());

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisionsWhenReportingNotRequired = new HashMap<>();
        reviewGroupDecisionsWhenReportingNotRequired.put(AerReviewGroup.REPORTING_OBLIGATION_DETAILS, AerDataReviewDecision.builder().build());

        return Stream.of(
            Arguments.of(true, true, false, 0, reviewGroupDecisionsWhenReportingRequired, reviewGroupDecisionsWhenReportingRequired),
            Arguments.of(false, true, false, 0, reviewGroupDecisionsWhenReportingRequired, Map.of()),
            Arguments.of(false, false, false, 0, reviewGroupDecisionsWhenReportingNotRequired, reviewGroupDecisionsWhenReportingNotRequired),
            Arguments.of(true, false, false, 0, reviewGroupDecisionsWhenReportingNotRequired, Map.of()),
            Arguments.of(true, true, true, 1, reviewGroupDecisionsWhenReportingRequired, reviewGroupDecisionsWhenReportingRequired)
        );
    }

    @ParameterizedTest
    @MethodSource("sendAmendedAerToRegulatorScenarios")
    void sendAmendedAerToRegulator(boolean requestTaskReportingRequired, boolean requestReportingRequired,
                                   boolean isVerificationPerformed,
                                   int setVerificationReportInvocations,
                                   int updateReportableEmissionsInvocations,
                                   int deleteReportableEmissionsInvocations,
                                   Map<AerReviewGroup, AerReviewDecision> requestPayloadReviewGroupDecisions,
                                   Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions,
                                   AerVerificationReport verificationReport,
                                   AerVerificationDecisionType type) {
        long accountId = 1L;
        String userId = UUID.randomUUID().toString();
        AppUser user = AppUser.builder().userId(userId).build();
        AerTotalEmissions totalEmissions = AerTotalEmissions.builder()
            .totalShipEmissionsSummary(new BigDecimal("1"))
            .surrenderEmissionsSummary(new BigDecimal("2"))
            .lessVoyagesInNorthernIrelandDeduction(AerPortEmissionsMeasurement.builder().total(new BigDecimal("3")).build())
            .build();

        Aer aer = Aer.builder().totalEmissions(totalEmissions).build();
        Map<String, String> sectionsCompleted = Map.of("section_a", "completed", "section_b", "completed");
        AerReportingObligationDetails reportingObligationDetails = AerReportingObligationDetails.builder().build();
        Map<UUID, String> aerAttachments = Map.of(UUID.randomUUID(), "file");
        AerTotalReportableEmissions totalReportableEmissions = AerTotalReportableEmissions.builder()
            .totalEmissions(new BigDecimal("1"))
            .surrenderEmissions(new BigDecimal("2"))
            .lessVoyagesInNorthernIrelandDeduction(new BigDecimal("3"))
            .build();

        AerRequestPayload requestPayload = AerRequestPayload.builder()
            .reportingRequired(requestReportingRequired)
            .reviewGroupDecisions(requestPayloadReviewGroupDecisions)
            .verificationReport(verificationReport)
            .build();

        AerRequestPayload expectedRequestPayload = AerRequestPayload.builder()
            .reportingRequired(requestTaskReportingRequired)
            .verificationReport(verificationReport)
            .totalEmissions(requestTaskReportingRequired ? totalReportableEmissions : null)
            .reportingObligationDetails(reportingObligationDetails)
            .aer(aer)
            .aerAttachments(aerAttachments)
            .verificationPerformed(isVerificationPerformed)
            .aerMonitoringPlanVersion(AerMonitoringPlanVersion.builder().build())
            .aerSubmitSectionsCompleted(sectionsCompleted)
            .reviewGroupDecisions(reviewGroupDecisions)
            .build();

        final Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .payload(requestPayload)
            .metadata(AerRequestMetadata.builder()
                .emissions(AerTotalReportableEmissions.builder().build())
                .overallAssessmentType(AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY_WITH_COMMENTS)
                .build())
            .build();

        AerRequestMetadata expectedMetadata = AerRequestMetadata.builder()
            .emissions(requestTaskReportingRequired ? totalReportableEmissions : null)
            .overallAssessmentType(type)
            .build();

        AerApplicationAmendsSubmitRequestTaskPayload requestTaskPayload =
            AerApplicationAmendsSubmitRequestTaskPayload.builder()
                .reportingRequired(requestTaskReportingRequired)
                .reportingObligationDetails(reportingObligationDetails)
                .aer(aer)
                .aerAttachments(aerAttachments)
                .verificationPerformed(isVerificationPerformed)
                .aerMonitoringPlanVersion(AerMonitoringPlanVersion.builder().build())
                .aerSectionsCompleted(sectionsCompleted)
                .build();

        Year reportingYear = Year.of(2025);
        AerContainer aerContainer = AerContainer.builder().reportingYear(reportingYear).verificationReport(verificationReport).build();

        final RequestTask requestTask = RequestTask.builder()
            .request(request)
            .payload(requestTaskPayload)
            .build();
        ReportableEmissionsUpdatedSubmittedEventDetails eventDetails = mock(ReportableEmissionsUpdatedSubmittedEventDetails.class);
        AerApplicationSubmittedRequestActionPayload requestActionPayload = mock(AerApplicationSubmittedRequestActionPayload.class);

        when(aerReviewMapper.toAerContainer(requestTaskPayload, verificationReport)).thenReturn(aerContainer);
        when(aerReviewMapper.toAerApplicationSubmittedRequestActionPayload(requestTaskPayload,
            MrtmRequestActionPayloadType.AER_APPLICATION_AMENDS_SUBMITTED_PAYLOAD)).thenReturn(requestActionPayload);
        lenient().when(reportableEmissionsService.calculateTotalReportableEmissions(aerContainer)).thenReturn(totalReportableEmissions);
        lenient().when(reportableEmissionsService.updateReportableEmissions(totalReportableEmissions, reportingYear, accountId, false))
            .thenReturn(eventDetails);

        reviewService.sendAmendedAerToRegulator(requestTask, user);

        assertEquals(expectedRequestPayload, request.getPayload());
        assertEquals(expectedMetadata, request.getMetadata());

        verify(aerReviewMapper).toAerContainer(requestTaskPayload, verificationReport);
        verify(aerReviewMapper)
            .toAerApplicationSubmittedRequestActionPayload(requestTaskPayload, MrtmRequestActionPayloadType.AER_APPLICATION_AMENDS_SUBMITTED_PAYLOAD);
        verify(aerValidatorService).validate(aerContainer, accountId);
        verify(requestService).addActionToRequest(request, requestActionPayload, MrtmRequestActionType.AER_APPLICATION_AMENDS_SUBMITTED, userId);
        verify(requestActionPayload, times(setVerificationReportInvocations)).setVerificationReport(verificationReport);
        verify(reportableEmissionsService, times(updateReportableEmissionsInvocations)).calculateTotalReportableEmissions(aerContainer);
        verify(reportableEmissionsService, times(updateReportableEmissionsInvocations))
            .updateReportableEmissions(totalReportableEmissions, reportingYear, accountId, false);
        verify(sendRegistryUpdatedEventAddRequestActionService, times(updateReportableEmissionsInvocations))
            .addRequestAction(request, eventDetails, userId);
        verify(reportableEmissionsService, times(deleteReportableEmissionsInvocations)).deleteReportableEmissions(accountId, reportingYear);
        verifyNoMoreInteractions(aerReviewMapper, aerValidatorService, requestService, reportableEmissionsService, requestActionPayload);
    }

    @ParameterizedTest
    @MethodSource("updateRequestPayloadWithSkipReviewOutcomeScenarios")
    void updateRequestPayloadWithSkipReviewOutcome(AerVoyageEmissions voyages, AerPortEmissions ports,
                                                   Set<AerReviewGroup> aerReviewGroups, boolean reportingRequired) {

        String userId = "userId";
        AppUser user = AppUser.builder().userId(userId).build();

        AerRequestPayload requestPayload = AerRequestPayload
                .builder()
                .reportingRequired(reportingRequired)
                .aer(Aer.builder().portEmissions(ports).smf(AerSmf.builder().exist(false).build()).voyageEmissions(voyages).build())
                .verificationReport(AerVerificationReport.builder().build())
                .build();
        Request request = Request.builder().payload(requestPayload).build();
        RequestTask requestTask = RequestTask.builder()
                .request(request)
                .build();

        AerApplicationSkipReviewRequestTaskActionPayload skipReviewRequestTaskPayload = AerApplicationSkipReviewRequestTaskActionPayload.builder()
                .aerSkipReviewDecision(AerSkipReviewDecision.builder().type(AerSkipReviewActionType.OTHER).reason("reason").build())
                .build();

        reviewService.updateRequestPayloadWithSkipReviewOutcome(requestTask, skipReviewRequestTaskPayload, user);

        AerRequestPayload updatedRequestPayload = (AerRequestPayload) request.getPayload();

        Assertions.assertTrue(updatedRequestPayload.getReviewGroupDecisions().values().stream().filter(
                AerDataReviewDecision.class::isInstance
        ).allMatch(dec -> ((AerDataReviewDecision) dec).getType() == AerDataReviewDecisionType.ACCEPTED));

        assertThat(new HashSet<>(updatedRequestPayload.getReviewGroupDecisions().keySet()))
            .containsExactlyInAnyOrderElementsOf(aerReviewGroups);

        Assertions.assertTrue(updatedRequestPayload.getReviewGroupDecisions().values().stream().filter(
                AerVerificationReportDataReviewDecision.class::isInstance
        ).allMatch(dec -> ((AerVerificationReportDataReviewDecision) dec).getType() == AerVerificationReportDataReviewDecisionType.ACCEPTED));
    }

    public static Stream<Arguments> updateRequestPayloadWithSkipReviewOutcomeScenarios() {
        Set<AerReviewGroup> mandatoryReviewGroups = new HashSet<>();
        mandatoryReviewGroups.add(AerReviewGroup.OPERATOR_DETAILS);
        mandatoryReviewGroups.add(AerReviewGroup.MONITORING_PLAN_CHANGES);
        mandatoryReviewGroups.add(AerReviewGroup.LIST_OF_SHIPS);
        mandatoryReviewGroups.add(AerReviewGroup.AGGREGATED_EMISSIONS_DATA);
        mandatoryReviewGroups.add(AerReviewGroup.EMISSIONS_REDUCTION_CLAIM);
        mandatoryReviewGroups.add(AerReviewGroup.TOTAL_EMISSIONS);
        mandatoryReviewGroups.add(AerReviewGroup.ADDITIONAL_DOCUMENTS);

        Set<AerReviewGroup> mandatoryReviewGroupsWithPorts = new HashSet<>(mandatoryReviewGroups);
        mandatoryReviewGroupsWithPorts.add(AerReviewGroup.PORTS);

        Set<AerReviewGroup> mandatoryReviewGroupsWithVoyages = new HashSet<>(mandatoryReviewGroups);
        mandatoryReviewGroupsWithVoyages.add(AerReviewGroup.VOYAGES);

        Set<AerReviewGroup> allReviewGroups = new HashSet<>(mandatoryReviewGroups);
        allReviewGroups.add(AerReviewGroup.VOYAGES);
        allReviewGroups.add(AerReviewGroup.PORTS);

        Set<AerReviewGroup> reportingNotRequiredReviewGroups = new HashSet<>();
        reportingNotRequiredReviewGroups.add(AerReviewGroup.REPORTING_OBLIGATION_DETAILS);

        AerVoyageEmissions voyages = AerVoyageEmissions.builder()
            .voyages(Set.of(AerVoyage.builder().build()))
            .build();
        AerPortEmissions ports = AerPortEmissions.builder()
            .ports(Set.of(AerPort.builder().build()))
            .build();

        return Stream.of(
            Arguments.of(null, null, reportingNotRequiredReviewGroups, false),
            Arguments.of(voyages, ports, allReviewGroups, true),
            Arguments.of(voyages, null, mandatoryReviewGroupsWithVoyages, true),
            Arguments.of(null, ports, mandatoryReviewGroupsWithPorts, true),
            Arguments.of(null, null, mandatoryReviewGroups, true)
        );
    }

    private static Stream<Arguments> sendAmendedAerToRegulatorScenarios() {
        AerDataReviewDecision verificationData = AerDataReviewDecision.builder()
            .reviewDataType(AerReviewDataType.VERIFICATION_REPORT_DATA)
            .build();

        AerDataReviewDecision aerData = AerDataReviewDecision.builder()
            .reviewDataType(AerReviewDataType.AER_DATA)
            .build();

        AerVerificationReport verificationReportSatisfactory = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder()
                .overallDecision(AerVerifiedSatisfactoryDecision
                    .builder()
                    .type(AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY)
                    .build())
                .build())
            .build();

        AerVerificationReport verificationReportNotVerified = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder()
                .overallDecision(AerVerifiedSatisfactoryDecision
                    .builder()
                    .type(AerVerificationDecisionType.NOT_VERIFIED)
                    .build())
                .build())
            .build();

        Map<AerReviewGroup, AerReviewDecision> aerReviewDecisions = new HashMap<>();
        aerReviewDecisions.put(AerReviewGroup.OPERATOR_DETAILS, aerData);
        aerReviewDecisions.put(AerReviewGroup.MONITORING_PLAN_CHANGES, aerData);
        aerReviewDecisions.put(AerReviewGroup.LIST_OF_SHIPS, aerData);
        aerReviewDecisions.put(AerReviewGroup.VOYAGES, aerData);
        aerReviewDecisions.put(AerReviewGroup.PORTS, aerData);
        aerReviewDecisions.put(AerReviewGroup.AGGREGATED_EMISSIONS_DATA, aerData);
        aerReviewDecisions.put(AerReviewGroup.EMISSIONS_REDUCTION_CLAIM, aerData);
        aerReviewDecisions.put(AerReviewGroup.TOTAL_EMISSIONS, aerData);
        aerReviewDecisions.put(AerReviewGroup.ADDITIONAL_DOCUMENTS, aerData);

        Map<AerReviewGroup, AerReviewDecision> verificationReviewDecisions = new HashMap<>();
        verificationReviewDecisions.put(AerReviewGroup.VERIFIER_DETAILS, verificationData);
        verificationReviewDecisions.put(AerReviewGroup.OPINION_STATEMENT, verificationData);
        verificationReviewDecisions.put(AerReviewGroup.ETS_COMPLIANCE_RULES, verificationData);
        verificationReviewDecisions.put(AerReviewGroup.COMPLIANCE_MONITORING_REPORTING, verificationData);
        verificationReviewDecisions.put(AerReviewGroup.OVERALL_DECISION, verificationData);
        verificationReviewDecisions.put(AerReviewGroup.UNCORRECTED_MISSTATEMENTS, verificationData);
        verificationReviewDecisions.put(AerReviewGroup.UNCORRECTED_NON_CONFORMITIES, verificationData);
        verificationReviewDecisions.put(AerReviewGroup.UNCORRECTED_NON_COMPLIANCES, verificationData);
        verificationReviewDecisions.put(AerReviewGroup.RECOMMENDED_IMPROVEMENTS, verificationData);
        verificationReviewDecisions.put(AerReviewGroup.CLOSE_DATA_GAPS_METHODOLOGIES, verificationData);
        verificationReviewDecisions.put(AerReviewGroup.MATERIALITY_LEVEL, verificationData);

        Map<AerReviewGroup, AerReviewDecision> allReviewDecisions = new HashMap<>();
        allReviewDecisions.putAll(verificationReviewDecisions);
        allReviewDecisions.putAll(aerReviewDecisions);

        return Stream.of(
            Arguments.of(true, true, false, 0, 1, 0, allReviewDecisions, aerReviewDecisions, null, AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY_WITH_COMMENTS),
            Arguments.of(true, true, false, 0, 1, 0, verificationReviewDecisions, Map.of(), null, AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY_WITH_COMMENTS),
            Arguments.of(true, true, false, 0, 1, 0, verificationReviewDecisions, verificationReviewDecisions, null, AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY_WITH_COMMENTS),
            Arguments.of(false, true, false, 0, 0, 1, verificationReviewDecisions, Map.of(), null, null),
            Arguments.of(true, true, true, 1, 1, 0, verificationReviewDecisions, verificationReviewDecisions, verificationReportSatisfactory, AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY),
            Arguments.of(true, true, true, 1, 1, 0, verificationReviewDecisions, verificationReviewDecisions, verificationReportNotVerified, AerVerificationDecisionType.NOT_VERIFIED)
        );
    }
}
