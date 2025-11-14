package uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerMonitoringPlanChanges;
import uk.gov.mrtm.api.reporting.domain.AerOperatorDetails;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationDecisionType;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifiedSatisfactoryDecision;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifierContact;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDataType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerVerificationReportDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerVerificationReportDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.math.BigDecimal;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerReviewMapperTest {

    private final AerReviewMapper reviewMapper = Mappers.getMapper(AerReviewMapper.class);

    @Test
    void toAerApplicationReviewRequestTaskPayload() {
        AerOperatorDetails operatorDetails = AerOperatorDetails.builder()
            .operatorName("name")
            .build();
        Aer aer = Aer.builder()
            .operatorDetails(operatorDetails)
            .build();
        Map<String, String> aerSectionsCompleted = Map.of(
            "operatorDetails", "Completed");
        Map<UUID, String> aerAttachments = Map.of(UUID.randomUUID(), "attachment1");
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder()
                .verifierContact(AerVerifierContact.builder().name("name").email("email").phoneNumber("3345678945").build())
                .overallDecision(AerVerifiedSatisfactoryDecision.builder().type(AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY).build())
                .build())
            .build();
        BigDecimal totalEmissions = BigDecimal.valueOf(14500);
        BigDecimal surrenderEmissions = BigDecimal.valueOf(7500);
        BigDecimal lessVoyagesInNorthernIrelandDeduction = BigDecimal.valueOf(3650);

        final AerTotalReportableEmissions totalReportableEmissions = AerTotalReportableEmissions.builder()
            .totalEmissions(totalEmissions)
            .surrenderEmissions(surrenderEmissions)
            .lessVoyagesInNorthernIrelandDeduction(lessVoyagesInNorthernIrelandDeduction)
            .build();

        String notCoveredChangesProvided = "not covered changes";
        AerRequestPayload requestPayload = AerRequestPayload.builder()
            .reportingRequired(Boolean.TRUE)
            .aer(aer)
            .aerSubmitSectionsCompleted(aerSectionsCompleted)
            .aerAttachments(aerAttachments)
            .verificationReport(verificationReport)
            .totalEmissions(totalReportableEmissions)
            .notCoveredChangesProvided(notCoveredChangesProvided)
            .build();

        String payloadType = MrtmRequestTaskPayloadType.AER_APPLICATION_REVIEW_PAYLOAD;
        Year reportingYear = Year.of(2023);

        AerApplicationReviewRequestTaskPayload expected = AerApplicationReviewRequestTaskPayload.builder()
            .payloadType(payloadType)
            .reportingYear(reportingYear)
            .reportingRequired(true)
            .aerAttachments(aerAttachments)
            .verificationReport(verificationReport)
            .aer(Aer.builder()
                .operatorDetails(AerOperatorDetails.builder()
                    .operatorName("name")
                    .build())
                .build())
            .totalEmissions(totalReportableEmissions)
            .notCoveredChangesProvided(notCoveredChangesProvided)
            .build();

        //invoke
        AerApplicationReviewRequestTaskPayload result =
            reviewMapper.toAerApplicationReviewRequestTaskPayload(requestPayload, payloadType, reportingYear);

        //verify
        assertEquals(expected, result);
    }

    @Test
    void toAerApplicationReturnedForAmendsRequestActionPayload() {

        UUID attachmentId1 = UUID.randomUUID();
        Map<UUID, String> reviewAttachments = Map.of(
            attachmentId1, "attachment1",
            UUID.randomUUID(), "attachment2"
        );
        Map<UUID, String> expectedReviewAttachments = Map.of(attachmentId1, "attachment1");

        AerDataReviewDecision aerDataReviewAcceptedDecision = AerDataReviewDecision.builder()
            .reviewDataType(AerReviewDataType.AER_DATA)
            .type(AerDataReviewDecisionType.ACCEPTED)
            .details(ReviewDecisionDetails.builder().notes("notes").build())
            .build();

        List<ReviewDecisionRequiredChange> reviewDecisionRequiredChanges = List.of(
            ReviewDecisionRequiredChange.builder().reason("reason").files(Set.of(attachmentId1)).build(),
            ReviewDecisionRequiredChange.builder().reason("another reason").build()
        );

        AerDataReviewDecision aerDataReviewAmendsNeededDecision = AerDataReviewDecision.builder()
            .type(AerDataReviewDecisionType.OPERATOR_AMENDS_NEEDED)
            .reviewDataType(AerReviewDataType.AER_DATA)
            .details(ChangesRequiredDecisionDetails.builder()
                .notes("notes")
                .requiredChanges(reviewDecisionRequiredChanges)
                .build())
            .build();

        AerVerificationReportDataReviewDecision verificationReportDataReviewDecision =
            AerVerificationReportDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.VERIFICATION_REPORT_DATA)
                .type(AerVerificationReportDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(AerReviewGroup.ADDITIONAL_DOCUMENTS, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.OPERATOR_DETAILS, aerDataReviewAmendsNeededDecision);
        reviewGroupDecisions.put(AerReviewGroup.VERIFIER_DETAILS, verificationReportDataReviewDecision);

        AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload = AerApplicationReviewRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_REVIEW_PAYLOAD)
            .reportingRequired(true)
            .aer(Aer.builder().build())
            .reviewGroupDecisions(reviewGroupDecisions)
            .reviewAttachments(reviewAttachments)
            .build();

        AerApplicationReturnedForAmendsRequestActionPayload expectedRequestActionPayload =
            AerApplicationReturnedForAmendsRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.AER_APPLICATION_RETURNED_FOR_AMENDS_PAYLOAD)
                .reviewAttachments(expectedReviewAttachments)
                .reviewGroupDecisions(Map.of(
                    AerReviewGroup.OPERATOR_DETAILS, AerDataReviewDecision.builder()
                        .type(AerDataReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                        .reviewDataType(AerReviewDataType.AER_DATA)
                        .details(ChangesRequiredDecisionDetails.builder()
                            .requiredChanges(reviewDecisionRequiredChanges)
                            .build())
                        .build()
                ))
                .build();

        //invoke
        AerApplicationReturnedForAmendsRequestActionPayload resultRequestActionPayload =
            reviewMapper.toAerApplicationReturnedForAmendsRequestActionPayload(
                reviewRequestTaskPayload,
                MrtmRequestActionPayloadType.AER_APPLICATION_RETURNED_FOR_AMENDS_PAYLOAD
            );

        //verify
        assertEquals(expectedRequestActionPayload, resultRequestActionPayload);
    }

    @Test
    void toAerApplicationAmendsSubmitRequestTaskPayload() {
        AerOperatorDetails operatorDetails = AerOperatorDetails.builder()
            .operatorName("name")
            .build();
        Aer aer = Aer.builder()
            .operatorDetails(operatorDetails)
            .aerMonitoringPlanChanges(AerMonitoringPlanChanges.builder().build())
            .smf(AerSmf.builder().exist(Boolean.FALSE).build())
            .build();
        Map<String, String> aerSectionsCompleted = Map.of(
            "operatorDetails", "COMPLETED",
            "monitoringApproach", "COMPLETED",
            "saf", "COMPLETED");
        Map<UUID, String> aerAttachments = Map.of(UUID.randomUUID(), "attachment1");

        AerDataReviewDecision aerDataReviewAcceptedDecision = AerDataReviewDecision.builder()
            .reviewDataType(AerReviewDataType.AER_DATA)
            .type(AerDataReviewDecisionType.ACCEPTED)
            .details(ReviewDecisionDetails.builder().notes("notes").build())
            .build();

        UUID reviewDecisionAttachmentId = UUID.randomUUID();
        List<ReviewDecisionRequiredChange> reviewDecisionRequiredChanges = List.of(
            ReviewDecisionRequiredChange.builder().reason("reason").files(Set.of(reviewDecisionAttachmentId)).build(),
            ReviewDecisionRequiredChange.builder().reason("another reason").build()
        );
        AerDataReviewDecision aerDataReviewAmendsNeededDecision = AerDataReviewDecision.builder()
            .type(AerDataReviewDecisionType.OPERATOR_AMENDS_NEEDED)
            .reviewDataType(AerReviewDataType.AER_DATA)
            .details(ChangesRequiredDecisionDetails.builder()
                .notes("notes")
                .requiredChanges(reviewDecisionRequiredChanges)
                .build())
            .build();

        AerVerificationReportDataReviewDecision verificationReportDataReviewDecision =
            AerVerificationReportDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.VERIFICATION_REPORT_DATA)
                .type(AerVerificationReportDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();

        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(AerReviewGroup.MONITORING_PLAN_CHANGES, aerDataReviewAcceptedDecision);
        reviewGroupDecisions.put(AerReviewGroup.OPERATOR_DETAILS, aerDataReviewAmendsNeededDecision);
        reviewGroupDecisions.put(AerReviewGroup.VERIFIER_DETAILS, verificationReportDataReviewDecision);

        Map<UUID, String> reviewAttachments = Map.of(reviewDecisionAttachmentId, "reviewAttachment1");

        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationBodyId(20L)
            .build();
        AerRequestPayload requestPayload = AerRequestPayload.builder()
            .reportingRequired(Boolean.TRUE)
            .aer(aer)
            .aerSubmitSectionsCompleted(aerSectionsCompleted)
            .aerAttachments(aerAttachments)
            .verificationPerformed(true)
            .verificationReport(verificationReport)
            .reviewGroupDecisions(reviewGroupDecisions)
            .reviewAttachments(reviewAttachments)
            .build();
        String payloadType = MrtmRequestTaskPayloadType.AER_APPLICATION_AMENDS_SUBMIT_PAYLOAD;
        Year reportingYear = Year.of(2023);

        AerApplicationAmendsSubmitRequestTaskPayload expected = AerApplicationAmendsSubmitRequestTaskPayload.builder()
            .payloadType(payloadType)
            .reportingYear(reportingYear)
            .reportingRequired(true)
            .aerSectionsCompleted(aerSectionsCompleted)
            .aerAttachments(aerAttachments)
            .aer(Aer.builder()
                .operatorDetails(AerOperatorDetails.builder()
                    .operatorName("name")
                    .build())
                .aerMonitoringPlanChanges(AerMonitoringPlanChanges.builder().build())
                .smf(AerSmf.builder().exist(Boolean.FALSE)
                    .build())
                .build())
            .reviewGroupDecisions(Map.of(
                AerReviewGroup.OPERATOR_DETAILS, AerDataReviewDecision.builder()
                    .type(AerDataReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                    .reviewDataType(AerReviewDataType.AER_DATA)
                    .details(ChangesRequiredDecisionDetails.builder()
                        .requiredChanges(reviewDecisionRequiredChanges)
                        .build())
                    .build()
            ))
            .reviewAttachments(reviewAttachments)
            .verificationPerformed(true)
            .verificationBodyId(20L)
            .build();

        //invoke
        AerApplicationAmendsSubmitRequestTaskPayload result =
            reviewMapper.toAerApplicationAmendsSubmitRequestTaskPayload(requestPayload, payloadType, reportingYear);

        //verify
        assertEquals(expected, result);
    }


    @Test
    void toAerContainer_with_verification_report() {
        Aer aer = Aer.builder()
            .operatorDetails(AerOperatorDetails.builder().operatorName("name").build())
            .build();
        Year reportingYear = Year.of(2022);
        Map<UUID, String> aerAttachments = Map.of(
            UUID.randomUUID(), "attachment1",
            UUID.randomUUID(), "attachment2"
        );
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder()
                .verifierContact(AerVerifierContact.builder().name("name").email("email").phoneNumber("3345678945").build())
                .overallDecision(AerVerifiedSatisfactoryDecision.builder().type(AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY).build())
                .build())
            .build();
        AerApplicationAmendsSubmitRequestTaskPayload amendsSubmitRequestTaskPayload =
            AerApplicationAmendsSubmitRequestTaskPayload.builder()
                .reportingYear(reportingYear)
                .reportingRequired(true)
                .aer(aer)
                .aerAttachments(aerAttachments)
                .build();

        AerContainer expected = AerContainer.builder()
            .reportingYear(reportingYear)
            .reportingRequired(true)
            .aer(aer)
            .aerAttachments(aerAttachments)
            .verificationReport(verificationReport)
            .build();

        //invoke
        AerContainer result = reviewMapper.toAerContainer(amendsSubmitRequestTaskPayload, verificationReport);

        //verify
        assertEquals(expected, result);
    }

}
