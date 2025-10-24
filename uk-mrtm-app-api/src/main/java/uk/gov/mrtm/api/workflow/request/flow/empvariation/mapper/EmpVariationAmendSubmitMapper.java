package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.util.AbstractMap;
import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpVariationAmendSubmitMapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "reviewGroupDecisions", source = "payload.reviewGroupDecisions", qualifiedByName = "reviewGroupDecisionsForOperatorAmend")
    @Mapping(target = "empVariationDetailsReviewDecision", source = "payload.empVariationDetailsReviewDecision", qualifiedByName = "variationDetailsReviewDecisionForOperatorAmend")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "reviewAttachments", ignore = true)
    EmpVariationApplicationReturnedForAmendsRequestActionPayload toEmpVariationApplicationReturnedForAmendsRequestActionPayload(
            EmpVariationApplicationReviewRequestTaskPayload payload, String payloadType);

    @AfterMapping
    default void setAmendReviewAttachments(@MappingTarget EmpVariationApplicationReturnedForAmendsRequestActionPayload actionPayload,
                                           EmpVariationApplicationReviewRequestTaskPayload payload) {
        actionPayload.setReviewAttachments(resolveAmendReviewAttachments(payload.getReviewAttachments(),
                payload.getReviewGroupDecisions(), payload.getEmpVariationDetailsReviewDecision()));
    }

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "empSectionsCompleted", ignore = true)
    @Mapping(target = "originalEmpContainer", ignore = true)
    @Mapping(target = "reviewGroupDecisions", source = "payload.reviewGroupDecisions", qualifiedByName = "reviewGroupDecisionsForOperatorAmend")
    @Mapping(target = "updatedSubtasks", ignore = true)
    @Mapping(target = "empVariationDetailsReviewDecision", source = "payload.empVariationDetailsReviewDecision", qualifiedByName = "variationDetailsReviewDecisionForOperatorAmend")
    EmpVariationApplicationAmendsSubmitRequestTaskPayload toEmpVariationApplicationAmendsSubmitRequestTaskPayload(
            EmpVariationRequestPayload payload, String payloadType);

    @AfterMapping
    default void setAmendReviewAttachments(@MappingTarget EmpVariationApplicationAmendsSubmitRequestTaskPayload requestTaskPayload,
                                           EmpVariationRequestPayload payload) {
        requestTaskPayload.setReviewAttachments(resolveAmendReviewAttachments(payload.getReviewAttachments(),
                payload.getReviewGroupDecisions(), payload.getEmpVariationDetailsReviewDecision()));
    }

    private Map<UUID, String> resolveAmendReviewAttachments(
            Map<UUID, String> reviewAttachments,
            Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions,
            EmpVariationReviewDecision variationDetailsReviewDecision) {
        final Set<UUID> amendFiles = reviewGroupDecisions.values().stream()
                .filter(empReviewDecision -> empReviewDecision.getType() == EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .flatMap(
                        empReviewDecision -> ((ChangesRequiredDecisionDetails) empReviewDecision.getDetails()).getRequiredChanges().stream()
                                .map(ReviewDecisionRequiredChange::getFiles))
                .flatMap(Collection::stream).collect(Collectors.toSet());

        final Set<UUID> variationDetailsReviewAttachmentsUuids = new HashSet<>();
        if (variationDetailsReviewDecision != null && EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED.equals(variationDetailsReviewDecision.getType())) {
            variationDetailsReviewAttachmentsUuids
                    .addAll(((ChangesRequiredDecisionDetails) variationDetailsReviewDecision.getDetails())
                            .getRequiredChanges().stream()
                            .flatMap(change -> change.getFiles().stream())
                            .collect(Collectors.toSet()));
        }

        final Set<UUID> allAmendFiles = Stream.of(amendFiles, variationDetailsReviewAttachmentsUuids)
                .flatMap(Set::stream)
                .collect(Collectors.toSet());

        return reviewAttachments.entrySet().stream()
                .filter(entry -> allAmendFiles.contains(entry.getKey()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Named("reviewGroupDecisionsForOperatorAmend")
    default Map<EmpReviewGroup, EmpVariationReviewDecision> setReviewGroupDecisionsForOperatorAmend(
            Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecision) {
        return reviewGroupDecision.entrySet().stream()
                .filter(entry -> entry.getValue().getType().equals(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)).map(entry ->
                        new AbstractMap.SimpleEntry<>(entry.getKey(), cloneAmendDecisionWithoutNotes(entry.getValue()))
                ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Named("variationDetailsReviewDecisionForOperatorAmend")
    default EmpVariationReviewDecision setVariationDetailsReviewDecisionForOperatorAmend(
            EmpVariationReviewDecision empVariationDetailsReviewDecision) {
        return (empVariationDetailsReviewDecision != null
                && empVariationDetailsReviewDecision.getType() == EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                ? cloneAmendDecisionWithoutNotes(empVariationDetailsReviewDecision)
                : null;
    }

    private EmpVariationReviewDecision cloneAmendDecisionWithoutNotes(EmpVariationReviewDecision empVariationReviewDecision) {
        return EmpVariationReviewDecision.builder()
                .type(empVariationReviewDecision.getType())
                .details(ChangesRequiredDecisionDetails.builder()
                        .requiredChanges(((ChangesRequiredDecisionDetails) empVariationReviewDecision.getDetails()).getRequiredChanges())
                        .build())
                .build();
    }

}
