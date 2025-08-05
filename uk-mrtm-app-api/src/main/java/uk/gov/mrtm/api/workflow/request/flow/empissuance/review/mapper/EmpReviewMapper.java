package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationAmendsSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.util.AbstractMap;
import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpReviewMapper {

    EmissionsMonitoringPlanContainer toEmissionsMonitoringPlanContainer(
            EmpIssuanceApplicationReviewRequestTaskPayload applicationReviewRequestTaskPayload);

    @Mapping(target = "emissionsMonitoringPlan.operatorDetails.attachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.operatorDetails.aerRelatedAttachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.empSectionAttachmentIds", ignore = true)
    EmissionsMonitoringPlanContainer toEmissionsMonitoringPlanContainer(EmpIssuanceRequestPayload requestPayload);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "empSectionsCompleted", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.operatorDetails.attachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.operatorDetails.aerRelatedAttachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.empSectionAttachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.managementProcedures.attachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.emissions.attachmentIds", ignore = true)
    EmpIssuanceApplicationReviewRequestTaskPayload toEmpIssuanceApplicationReviewRequestTaskPayload(
        EmpIssuanceRequestPayload requestPayload,
        String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "emissionsMonitoringPlan.operatorDetails.attachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.operatorDetails.aerRelatedAttachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.empSectionAttachmentIds", ignore = true)
    EmpIssuanceApplicationApprovedRequestActionPayload toEmpIssuanceApplicationApprovedRequestActionPayload(
            EmpIssuanceRequestPayload requestPayload, String operatorName, Map<String, RequestActionUserInfo> usersInfo,
            AddressStateDTO contactAddress,  String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload toEmpIssuanceApplicationDeemedWithdrawnRequestActionPayload(
            EmpIssuanceRequestPayload requestPayload, Map<String, RequestActionUserInfo> usersInfo, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "reviewGroupDecisions", source = "payload.reviewGroupDecisions", qualifiedByName = "reviewGroupDecisionsForOperatorAmend")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "reviewAttachments", ignore = true)
    EmpIssuanceApplicationReturnedForAmendsRequestActionPayload toEmpIssuanceApplicationReturnedForAmendsRequestActionPayload(
        EmpIssuanceApplicationReviewRequestTaskPayload payload, String payloadType);

    @AfterMapping
    default void setAmendReviewAttachments(@MappingTarget EmpIssuanceApplicationReturnedForAmendsRequestActionPayload actionPayload,
                                           EmpIssuanceApplicationReviewRequestTaskPayload payload) {
        Set<UUID> amendFiles = actionPayload.getReviewGroupDecisions().values().stream()
            .filter(empReviewDecision -> empReviewDecision.getType() == EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED)
            .flatMap(
                empReviewDecision -> ((ChangesRequiredDecisionDetails) empReviewDecision.getDetails()).getRequiredChanges().stream()
                    .map(ReviewDecisionRequiredChange::getFiles))
            .flatMap(Collection::stream).collect(Collectors.toSet());

        Map<UUID, String> reviewFiles = payload.getReviewAttachments().entrySet().stream()
            .filter(entry -> amendFiles.contains(entry.getKey()))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        actionPayload.setReviewAttachments(reviewFiles);
    }

    @Named("reviewGroupDecisionsForOperatorAmend")
    default Map<EmpReviewGroup, EmpIssuanceReviewDecision> setReviewGroupDecisionsForOperatorAmend(
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecision) {
        return reviewGroupDecision.entrySet().stream()
            .filter(entry -> entry.getValue().getType().equals(EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED)).map(entry ->
                new AbstractMap.SimpleEntry<>(entry.getKey(),
                    EmpIssuanceReviewDecision.builder()
                        .type(entry.getValue().getType())
                        .details(ChangesRequiredDecisionDetails.builder()
                            .requiredChanges(((ChangesRequiredDecisionDetails) entry.getValue().getDetails()).getRequiredChanges()).build())
                        .build())
            ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "empSectionsCompleted", ignore = true)
    @Mapping(target = "reviewGroupDecisions", source = "empIssuanceRequestPayload.reviewGroupDecisions", qualifiedByName = "reviewGroupDecisionsForOperatorAmend")
    EmpIssuanceApplicationAmendsSubmitRequestTaskPayload toEmpIssuanceApplicationAmendsSubmitRequestTaskPayload(
        EmpIssuanceRequestPayload empIssuanceRequestPayload, String payloadType);

    @AfterMapping
    default void setAmendReviewAttachments(@MappingTarget EmpIssuanceApplicationAmendsSubmitRequestTaskPayload requestTaskPayload,
                                           EmpIssuanceRequestPayload payload) {
        Set<UUID> amendFiles = requestTaskPayload.getReviewGroupDecisions().values().stream()
            .filter(empReviewDecision -> empReviewDecision.getType() == EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED)
            .flatMap(
                empReviewDecision -> ((ChangesRequiredDecisionDetails) empReviewDecision.getDetails()).getRequiredChanges().stream()
                    .map(ReviewDecisionRequiredChange::getFiles))
            .flatMap(Collection::stream).collect(Collectors.toSet());

        Map<UUID, String> reviewFiles = payload.getReviewAttachments().entrySet().stream()
            .filter(entry -> amendFiles.contains(entry.getKey()))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        requestTaskPayload.setReviewAttachments(reviewFiles);
    }

    @Mapping(target = "payloadType", source = "payloadType")
    EmpIssuanceApplicationAmendsSubmittedRequestActionPayload toEmpIssuanceApplicationAmendsSubmittedRequestActionPayload(
        EmpIssuanceRequestPayload requestPayload, String payloadType);
}
