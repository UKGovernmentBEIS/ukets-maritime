package uk.gov.mrtm.api.workflow.request.flow.aer.review.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortEmissions;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyage;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageEmissions;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDataType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerVerificationReportDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerVerificationReportDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class RequestAerReviewValidatorServiceTest {

    @InjectMocks
    private RequestAerReviewValidatorService reviewValidatorService;

    @Test
    void validateReviewGroups_no_reporting_obligation_valid() {
        AerDataReviewDecision aerDataReviewDecision = AerDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.AER_DATA)
                .type(AerDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(AerReviewGroup.REPORTING_OBLIGATION_DETAILS, aerDataReviewDecision);

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                AerApplicationReviewRequestTaskPayload.builder()
                        .reportingRequired(false)
                        .aer(Aer.builder().smf(AerSmf.builder().exist(true).build()).build())
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .build();

        reviewValidatorService.validateAllReviewGroupsExistAndAccepted(reviewRequestTaskPayload, false);
    }

    @Test
    void validateReviewGroups_no_reporting_obligation_invalid() {
        AerDataReviewDecision aerDataReviewDecision = AerDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.AER_DATA)
                .type(AerDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(AerReviewGroup.REPORTING_OBLIGATION_DETAILS, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.LIST_OF_SHIPS, aerDataReviewDecision);

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                AerApplicationReviewRequestTaskPayload.builder()
                        .reportingRequired(false)
                        .aer(Aer.builder().smf(AerSmf.builder().exist(false).build()).build())
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .build();

        BusinessException be = assertThrows(BusinessException.class,
                () -> reviewValidatorService.validateAllReviewGroupsExistAndAccepted(reviewRequestTaskPayload, false));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.FORM_VALIDATION);
    }

    @Test
    void validateReviewGroups_without_verification_report_valid() {
        Aer aer = Aer.builder()
            .smf(AerSmf.builder().exist(true).build())
            .build();

        AerDataReviewDecision aerDataReviewDecision = AerDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.AER_DATA)
                .type(AerDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(AerReviewGroup.LIST_OF_SHIPS, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.OPERATOR_DETAILS, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.MONITORING_PLAN_CHANGES, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.AGGREGATED_EMISSIONS_DATA, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.EMISSIONS_REDUCTION_CLAIM, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.TOTAL_EMISSIONS, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.ADDITIONAL_DOCUMENTS, aerDataReviewDecision);

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                AerApplicationReviewRequestTaskPayload.builder()
                        .reportingRequired(true)
                        .aer(aer)
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .build();

        reviewValidatorService.validateAllReviewGroupsExistAndAccepted(reviewRequestTaskPayload, false);
    }

    @ParameterizedTest
    @MethodSource("validateReviewGroupsValidScenarios")
    void validateReviewGroups_with_verification_report_valid(boolean smfExist,
                                                             Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions) {
        Aer aer = Aer.builder()
            .smf(AerSmf.builder().exist(smfExist).build())
            .build();
        AerVerificationReport verificationReport = AerVerificationReport.builder()
                .build();

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                AerApplicationReviewRequestTaskPayload.builder()
                        .reportingRequired(true)
                        .aer(aer)
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .verificationReport(verificationReport)
                        .build();

        reviewValidatorService.validateAllReviewGroupsExistAndAccepted(reviewRequestTaskPayload, true);
    }

    public static Stream<Arguments> validateReviewGroupsValidScenarios() {
        AerDataReviewDecision aerDataReviewDecision = AerDataReviewDecision.builder()
            .reviewDataType(AerReviewDataType.AER_DATA)
            .type(AerDataReviewDecisionType.ACCEPTED)
            .details(ReviewDecisionDetails.builder().notes("notes").build())
            .build();

        AerVerificationReportDataReviewDecision verificationReportDataReviewDecision =
            AerVerificationReportDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.VERIFICATION_REPORT_DATA)
                .type(AerVerificationReportDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(AerReviewGroup.LIST_OF_SHIPS, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.OPERATOR_DETAILS, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.MONITORING_PLAN_CHANGES, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.AGGREGATED_EMISSIONS_DATA, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.EMISSIONS_REDUCTION_CLAIM, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.TOTAL_EMISSIONS, aerDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.ADDITIONAL_DOCUMENTS, aerDataReviewDecision);

        reviewGroupDecisions.put(AerReviewGroup.VERIFIER_DETAILS, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.OPINION_STATEMENT, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.ETS_COMPLIANCE_RULES, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.COMPLIANCE_MONITORING_REPORTING, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.OVERALL_DECISION, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.UNCORRECTED_MISSTATEMENTS, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.UNCORRECTED_NON_CONFORMITIES, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.UNCORRECTED_NON_COMPLIANCES, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.RECOMMENDED_IMPROVEMENTS, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.CLOSE_DATA_GAPS_METHODOLOGIES, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.MATERIALITY_LEVEL, verificationReportDataReviewDecision);

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisionsWithSmf = new HashMap<>(reviewGroupDecisions);
        reviewGroupDecisionsWithSmf.put(AerReviewGroup.EMISSIONS_REDUCTION_CLAIM_VERIFICATION, verificationReportDataReviewDecision);

        return Stream.of(
            Arguments.of(true, reviewGroupDecisionsWithSmf),
            Arguments.of(false, reviewGroupDecisions)
        );
    }

    @ParameterizedTest
    @MethodSource("updateRequestPayloadWithSkipReviewOutcomeScenarios")
    void validateReviewGroups_with_or_without_ports_or_voyages(AerVoyageEmissions voyages, AerPortEmissions ports,
                                                               Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions) {
        Aer aer = Aer.builder()
            .portEmissions(ports)
            .voyageEmissions(voyages)
            .smf(AerSmf.builder().exist(false).build())
            .build();
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .build();

        AerVerificationReportDataReviewDecision verificationReportDataReviewDecision =
            AerVerificationReportDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.VERIFICATION_REPORT_DATA)
                .type(AerVerificationReportDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();

        reviewGroupDecisions.put(AerReviewGroup.VERIFIER_DETAILS, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.OPINION_STATEMENT, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.ETS_COMPLIANCE_RULES, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.COMPLIANCE_MONITORING_REPORTING, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.OVERALL_DECISION, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.UNCORRECTED_MISSTATEMENTS, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.UNCORRECTED_NON_CONFORMITIES, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.UNCORRECTED_NON_COMPLIANCES, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.RECOMMENDED_IMPROVEMENTS, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.CLOSE_DATA_GAPS_METHODOLOGIES, verificationReportDataReviewDecision);
        reviewGroupDecisions.put(AerReviewGroup.MATERIALITY_LEVEL, verificationReportDataReviewDecision);

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
            AerApplicationReviewRequestTaskPayload.builder()
                .reportingRequired(true)
                .aer(aer)
                .reviewGroupDecisions(reviewGroupDecisions)
                .verificationReport(verificationReport)
                .build();

        reviewValidatorService.validateAllReviewGroupsExistAndAccepted(reviewRequestTaskPayload, true);
    }


    public static Stream<Arguments> updateRequestPayloadWithSkipReviewOutcomeScenarios() {
        AerDataReviewDecision aerDataReviewDecision = AerDataReviewDecision.builder()
            .reviewDataType(AerReviewDataType.AER_DATA)
            .type(AerDataReviewDecisionType.ACCEPTED)
            .details(ReviewDecisionDetails.builder().notes("notes").build())
            .build();

        Map<AerReviewGroup, AerReviewDecision> mandatoryReviewGroups = new HashMap<>();
        mandatoryReviewGroups.put(AerReviewGroup.OPERATOR_DETAILS, aerDataReviewDecision);
        mandatoryReviewGroups.put(AerReviewGroup.MONITORING_PLAN_CHANGES, aerDataReviewDecision);
        mandatoryReviewGroups.put(AerReviewGroup.LIST_OF_SHIPS, aerDataReviewDecision);
        mandatoryReviewGroups.put(AerReviewGroup.AGGREGATED_EMISSIONS_DATA, aerDataReviewDecision);
        mandatoryReviewGroups.put(AerReviewGroup.EMISSIONS_REDUCTION_CLAIM, aerDataReviewDecision);
        mandatoryReviewGroups.put(AerReviewGroup.TOTAL_EMISSIONS, aerDataReviewDecision);
        mandatoryReviewGroups.put(AerReviewGroup.ADDITIONAL_DOCUMENTS, aerDataReviewDecision);


        Map<AerReviewGroup, AerReviewDecision> mandatoryReviewGroupsWithPorts = new HashMap<>(mandatoryReviewGroups);
        mandatoryReviewGroupsWithPorts.put(AerReviewGroup.PORTS, aerDataReviewDecision);

        Map<AerReviewGroup, AerReviewDecision> mandatoryReviewGroupsWithVoyages = new HashMap<>(mandatoryReviewGroups);
        mandatoryReviewGroupsWithVoyages.put(AerReviewGroup.VOYAGES, aerDataReviewDecision);

        Map<AerReviewGroup, AerReviewDecision> allReviewGroups = new HashMap<>(mandatoryReviewGroups);
        allReviewGroups.put(AerReviewGroup.PORTS, aerDataReviewDecision);
        allReviewGroups.put(AerReviewGroup.VOYAGES, aerDataReviewDecision);

        AerVoyageEmissions voyages = AerVoyageEmissions.builder()
            .voyages(Set.of(AerVoyage.builder().build()))
            .build();
        AerPortEmissions ports = AerPortEmissions.builder()
            .ports(Set.of(AerPort.builder().build()))
            .build();

        return Stream.of(
            Arguments.of(voyages, ports, allReviewGroups),
            Arguments.of(voyages, null, mandatoryReviewGroupsWithVoyages),
            Arguments.of(null, ports, mandatoryReviewGroupsWithPorts),
            Arguments.of(null, null, mandatoryReviewGroups)
        );
    }

    @Test
    void validateReviewGroups_invalid_decision() {
        Aer aer = Aer.builder()
            .smf(AerSmf.builder().exist(true).build())
            .build();

        AerDataReviewDecision aerDataReviewAcceptedDecision = AerDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.AER_DATA)
                .type(AerDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();

        AerDataReviewDecision aerDataReviewAmendsDecision = AerDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.AER_DATA)
                .type(AerDataReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ChangesRequiredDecisionDetails.builder().notes("notes").build())
                .build();


        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(AerReviewGroup.LIST_OF_SHIPS, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.OPERATOR_DETAILS, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.MONITORING_PLAN_CHANGES, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.VOYAGES, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.AGGREGATED_EMISSIONS_DATA, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.PORTS, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.EMISSIONS_REDUCTION_CLAIM, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.TOTAL_EMISSIONS, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.ADDITIONAL_DOCUMENTS, aerDataReviewAmendsDecision);

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                AerApplicationReviewRequestTaskPayload.builder()
                        .reportingRequired(true)
                        .aer(aer)
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .build();

        BusinessException be = assertThrows(BusinessException.class,
                () -> reviewValidatorService.validateAllReviewGroupsExistAndAccepted(reviewRequestTaskPayload, false));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.FORM_VALIDATION);
    }

    @Test
    void validateReviewGroups_invalid_missing_group() {
        Aer aer = Aer.builder()
            .smf(AerSmf.builder().exist(true).build())
            .build();

        AerDataReviewDecision aerDataReviewAcceptedDecision = AerDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.AER_DATA)
                .type(AerDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(AerReviewGroup.LIST_OF_SHIPS, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.OPERATOR_DETAILS, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.MONITORING_PLAN_CHANGES, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.VOYAGES, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.AGGREGATED_EMISSIONS_DATA, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.PORTS, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.EMISSIONS_REDUCTION_CLAIM, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.TOTAL_EMISSIONS, aerDataReviewAcceptedDecision);

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                AerApplicationReviewRequestTaskPayload.builder()
                        .reportingRequired(true)
                        .aer(aer)
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .build();

        BusinessException be = assertThrows(BusinessException.class,
                () -> reviewValidatorService.validateAllReviewGroupsExistAndAccepted(reviewRequestTaskPayload, false));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.FORM_VALIDATION);
    }

    @Test
    void validateAtLeastOneReviewGroupAmendsNeeded_invalid() {
        Aer aer = Aer.builder().build();

        AerDataReviewDecision aerDataReviewAcceptedDecision = AerDataReviewDecision.builder()
            .reviewDataType(AerReviewDataType.AER_DATA)
            .type(AerDataReviewDecisionType.ACCEPTED)
            .details(ReviewDecisionDetails.builder().notes("notes").build())
            .build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(AerReviewGroup.ADDITIONAL_DOCUMENTS, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.OPERATOR_DETAILS, aerDataReviewAcceptedDecision);

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
            AerApplicationReviewRequestTaskPayload.builder()
                .reportingRequired(true)
                .aer(aer)
                .reviewGroupDecisions(reviewGroupDecisions)
                .build();

        BusinessException be = assertThrows(BusinessException.class,
            () -> reviewValidatorService.validateAtLeastOneReviewGroupAmendsNeeded(reviewRequestTaskPayload));

        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_AER_REVIEW);
    }

    @Test
    void validateAtLeastOneReviewGroupAmendsNeeded_valid() {
        Aer aer = Aer.builder().build();

        AerDataReviewDecision aerDataReviewAcceptedDecision = AerDataReviewDecision.builder()
            .reviewDataType(AerReviewDataType.AER_DATA)
            .type(AerDataReviewDecisionType.ACCEPTED)
            .details(ReviewDecisionDetails.builder().notes("notes").build())
            .build();

        AerDataReviewDecision aerDataReviewAmendsNeededDecision = AerDataReviewDecision.builder()
            .type(AerDataReviewDecisionType.OPERATOR_AMENDS_NEEDED)
            .reviewDataType(AerReviewDataType.AER_DATA)
            .details(ChangesRequiredDecisionDetails.builder().build())
            .build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(AerReviewGroup.ADDITIONAL_DOCUMENTS, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.OPERATOR_DETAILS, aerDataReviewAmendsNeededDecision);

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
            AerApplicationReviewRequestTaskPayload.builder()
                .reportingRequired(true)
                .aer(aer)
                .reviewGroupDecisions(reviewGroupDecisions)
                .build();

        reviewValidatorService.validateAtLeastOneReviewGroupAmendsNeeded(reviewRequestTaskPayload);
    }
}
