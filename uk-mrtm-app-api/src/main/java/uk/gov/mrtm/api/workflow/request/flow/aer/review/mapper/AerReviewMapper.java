package uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDataType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.time.Year;
import java.util.AbstractMap;
import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AerReviewMapper {

    AerContainer toAerContainer(AerApplicationAmendsSubmitRequestTaskPayload taskPayload);

    AerContainer toAerContainer(AerApplicationAmendsSubmitRequestTaskPayload taskPayload,
                                AerVerificationReport verificationReport);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    AerApplicationSubmittedRequestActionPayload toAerApplicationSubmittedRequestActionPayload(
        AerApplicationAmendsSubmitRequestTaskPayload taskPayload,
        String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "verificationReport", source = "requestPayload.verificationReport")
    @Mapping(target = "aerSectionsCompleted", ignore = true)
    AerApplicationReviewRequestTaskPayload toAerApplicationReviewRequestTaskPayload(
            AerRequestPayload requestPayload,
            String payloadType,
            Year reportingYear);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "reviewGroupDecisions", source = "requestTaskPayload.reviewGroupDecisions", qualifiedByName = "reviewGroupDecisionsForOperatorAmend")
    @Mapping(target = "attachments", ignore = true)
    AerApplicationReturnedForAmendsRequestActionPayload toAerApplicationReturnedForAmendsRequestActionPayload(
        AerApplicationReviewRequestTaskPayload requestTaskPayload,
        String payloadType);

    @AfterMapping
    default void setAmendReviewAttachments(@MappingTarget AerApplicationReturnedForAmendsRequestActionPayload actionPayload,
                                           AerApplicationReviewRequestTaskPayload payload) {
        Set<UUID> amendFiles = actionPayload.getReviewGroupDecisions().values().stream()
            .filter(aerReviewDecision -> aerReviewDecision.getReviewDataType() == AerReviewDataType.AER_DATA)
            .filter(aerReviewDecision -> ((AerDataReviewDecision) aerReviewDecision).getType().equals(AerDataReviewDecisionType.OPERATOR_AMENDS_NEEDED))
            .map(aerReviewDecision -> (AerDataReviewDecision) aerReviewDecision)
            .flatMap(
                aerDataReviewDecision -> ((ChangesRequiredDecisionDetails) aerDataReviewDecision.getDetails()).getRequiredChanges().stream()
                    .map(ReviewDecisionRequiredChange::getFiles))
            .flatMap(Collection::stream).collect(Collectors.toSet());

        Map<UUID, String> reviewFiles = payload.getReviewAttachments().entrySet().stream()
            .filter(entry -> amendFiles.contains(entry.getKey()))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        actionPayload.setReviewAttachments(reviewFiles);
    }

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "reviewGroupDecisions", source = "requestPayload.reviewGroupDecisions", qualifiedByName =
        "reviewGroupDecisionsForOperatorAmend")
    @Mapping(target = "verificationBodyId", source = "requestPayload", qualifiedByName = "verificationBodyId")
    AerApplicationAmendsSubmitRequestTaskPayload toAerApplicationAmendsSubmitRequestTaskPayload(
        AerRequestPayload requestPayload,
        String payloadType,
        Year reportingYear);

    @Named("reviewGroupDecisionsForOperatorAmend")
    default Map<AerReviewGroup, AerReviewDecision> setReviewGroupDecisionsForOperatorAmend(Map<AerReviewGroup, AerReviewDecision> reviewGroupDecision) {
        return reviewGroupDecision.entrySet().stream()
            .filter(aerReviewDecision -> aerReviewDecision.getValue().getReviewDataType() == AerReviewDataType.AER_DATA)
            .filter(entry -> ((AerDataReviewDecision) entry.getValue()).getType() == AerDataReviewDecisionType.OPERATOR_AMENDS_NEEDED)
            .map(entry -> {
                    AerDataReviewDecision aerDataReviewDecision = (AerDataReviewDecision) entry.getValue();
                    return new AbstractMap.SimpleEntry<>(entry.getKey(),
                        AerDataReviewDecision.builder()
                            .type(aerDataReviewDecision.getType())
                            .reviewDataType(AerReviewDataType.AER_DATA)
                            .details(ChangesRequiredDecisionDetails.builder()
                                .requiredChanges(((ChangesRequiredDecisionDetails) aerDataReviewDecision.getDetails()).getRequiredChanges()).build())
                            .build());
                }
            ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Named("verificationBodyId")
    default Long setVerificationBodyId(AerRequestPayload requestPayload) {
        return requestPayload.isVerificationPerformed() ?
            requestPayload.getVerificationReport().getVerificationBodyId() : null;
    }

}
