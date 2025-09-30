package uk.gov.mrtm.api.workflow.request.flow.vir.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.common.VerifierComment;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.OperatorImprovementFollowUpResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationRespondedToRegulatorCommentsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirVerificationData;
import uk.gov.netz.api.common.config.MapperConfig;

import java.time.Year;
import java.util.AbstractMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface VirMapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    VirApplicationSubmittedRequestActionPayload toVirApplicationSubmittedRequestActionPayload(
        VirApplicationSubmitRequestTaskPayload taskPayload,
        Year reportingYear, String payloadType);

    default VirVerificationData toVirVerificationData(final AerVerificationData aerVerificationData){

        VirVerificationData virVerificationData = VirVerificationData.builder().build();

        Optional.ofNullable(aerVerificationData.getUncorrectedNonConformities())
                .ifPresent(uncorrectedNonConformities -> {
                    uncorrectedNonConformities.getUncorrectedNonConformities()
                            .forEach(
                                    item -> virVerificationData.getUncorrectedNonConformities().put(item.getReference(), item));
                    uncorrectedNonConformities.getPriorYearIssues()
                            .forEach(item -> virVerificationData.getPriorYearIssues().put(item.getReference(), item));
                });

        if (!ObjectUtils.isEmpty(aerVerificationData.getRecommendedImprovements()) &&
                !ObjectUtils.isEmpty(aerVerificationData.getRecommendedImprovements().getRecommendedImprovements())) {

            aerVerificationData.getRecommendedImprovements().getRecommendedImprovements()
                    .forEach(item -> virVerificationData.getRecommendedImprovements().put(item.getReference(), item));
        }

        return virVerificationData;
    }

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    VirApplicationReviewedRequestActionPayload toVirApplicationReviewedRequestActionPayload(
            VirRequestPayload requestPayload, Year reportingYear, String payloadType);

    @Mapping(target = "regulatorReviewResponse.regulatorImprovementResponses", source = "regulatorReviewResponse.regulatorImprovementResponses", qualifiedByName = "regulatorImprovementResponsesIgnoreComments")
    VirApplicationReviewedRequestActionPayload cloneReviewedPayloadIgnoreComments(
            VirApplicationReviewedRequestActionPayload payload);

    @Named("regulatorImprovementResponsesIgnoreComments")
    default Map<String, RegulatorImprovementResponse> regulatorImprovementResponsesIgnoreComments(
            Map<String, RegulatorImprovementResponse> regulatorImprovementResponses) {

        return regulatorImprovementResponses.entrySet().stream().map(entry ->
                new AbstractMap.SimpleEntry<>(entry.getKey(),
                        RegulatorImprovementResponse.builder()
                                .improvementRequired(entry.getValue().isImprovementRequired())
                                .improvementDeadline(entry.getValue().getImprovementDeadline())
                                .operatorActions(entry.getValue().getOperatorActions())
                                .build())
        ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    VirApplicationRespondedToRegulatorCommentsRequestActionPayload toVirApplicationRespondedToRegulatorCommentsRequestActionPayload(
            VirRequestPayload requestPayload,
            Year reportingYear,
            OperatorImprovementFollowUpResponse operatorImprovementFollowUpResponse,
            String reference, String payloadType);

    @AfterMapping
    default void setImprovementResponses(
            @MappingTarget VirApplicationRespondedToRegulatorCommentsRequestActionPayload actionPayload,
            VirRequestPayload requestPayload,
            String reference
    ) {
        actionPayload.setOperatorImprovementResponse(requestPayload.getOperatorImprovementResponses().get(reference));
        actionPayload.setRegulatorImprovementResponse(requestPayload.getRegulatorReviewResponse().getRegulatorImprovementResponses().get(reference));

        Map<String, UncorrectedItem> uncorrectedItemMap = requestPayload.getVerificationData().getUncorrectedNonConformities();

        Optional.ofNullable(uncorrectedItemMap.get(reference)).ifPresentOrElse(
                actionPayload::setVerifierUncorrectedItem,
                () -> {
                    Map<String, VerifierComment> verifierCommentItemMap = Stream.of(
                                    requestPayload.getVerificationData().getPriorYearIssues(),
                                    requestPayload.getVerificationData().getRecommendedImprovements())
                            .flatMap(map -> map.entrySet().stream())
                            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
                    Optional.ofNullable(verifierCommentItemMap.get(reference)).ifPresent(actionPayload::setVerifierComment);
                });
    }

    @Mapping(target = "regulatorImprovementResponse.improvementComments", ignore = true)
    VirApplicationRespondedToRegulatorCommentsRequestActionPayload cloneRespondedPayloadIgnoreComments(
            VirApplicationRespondedToRegulatorCommentsRequestActionPayload payload
    );

}
