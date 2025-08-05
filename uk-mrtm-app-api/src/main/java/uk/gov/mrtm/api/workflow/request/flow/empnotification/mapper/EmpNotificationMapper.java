package uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotificationContainer;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

import java.util.ArrayList;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpNotificationMapper {

    EmissionsMonitoringPlanNotificationContainer toEmpNotificationContainer(EmpNotificationApplicationSubmitRequestTaskPayload payload);

    @Mapping(target = "payloadType", expression = "java(uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_SUBMITTED_PAYLOAD)")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "empNotificationAttachments", ignore = true)
    EmpNotificationApplicationSubmittedRequestActionPayload toApplicationSubmittedRequestActionPayload(
            EmpNotificationApplicationSubmitRequestTaskPayload payload);

    @Mapping(target = "payloadType", source = "payloadType")
    EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload toEmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload(
            EmpNotificationRequestPayload requestPayload, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "sectionsCompleted", source = "requestPayload.reviewSectionsCompleted")
    EmpNotificationApplicationReviewRequestTaskPayload toApplicationReviewRequestTaskPayload(
        EmpNotificationRequestPayload requestPayload, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "reviewDecision", source = "payload.reviewDecision", qualifiedByName = "followUpReviewDecisionWithoutNotes")
    EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload cloneCompletedPayloadIgnoreNotes(
        EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload payload, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "reviewDecision", source = "payload.reviewDecision", qualifiedByName = "reviewDecisionWithoutNotes")
    EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload cloneReviewSubmittedPayloadIgnoreNotes(
        EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload payload, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "decisionDetails.notes", ignore = true)
    EmpNotificationFollowUpReturnedForAmendsRequestActionPayload cloneReturnedForAmendsIgnoreNotes(
            EmpNotificationFollowUpReturnedForAmendsRequestActionPayload payload, String payloadType);

    default EmpNotificationFollowUpReviewDecision cloneFollowUpReviewDecisionIgnoreNotes(
        EmpNotificationFollowUpReviewDecision source) {
        ReviewDecisionDetails details;
        if (source.getType()== EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED) {
            EmpNotificationFollowupRequiredChangesDecisionDetails sourceDetails =
                (EmpNotificationFollowupRequiredChangesDecisionDetails) source.getDetails();
            details = EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                .dueDate(sourceDetails.getDueDate())
                .requiredChanges(new ArrayList<>(sourceDetails.getRequiredChanges()))
                .build();
        } else {
            details = ReviewDecisionDetails.builder().build();
        }

        return EmpNotificationFollowUpReviewDecision.builder()
            .details(details)
            .type(source.getType())
            .build();
    }

    @Named("followUpReviewDecisionWithoutNotes")
    default EmpNotificationFollowUpReviewDecision setReviewDecision(EmpNotificationFollowUpReviewDecision sourceReviewDecision) {
        return cloneFollowUpReviewDecisionIgnoreNotes(sourceReviewDecision);
    }

    @Named("reviewDecisionWithoutNotes")
    default EmpNotificationReviewDecision setReviewDecision(EmpNotificationReviewDecision sourceReviewDecision) {
        ReviewDecisionDetails details;
        if (sourceReviewDecision.getType()== EmpNotificationReviewDecisionType.ACCEPTED) {
            EmpNotificationAcceptedDecisionDetails sourceDetails = (EmpNotificationAcceptedDecisionDetails)sourceReviewDecision.getDetails();
            details = EmpNotificationAcceptedDecisionDetails.builder()
                    .followUp(sourceDetails.getFollowUp())
                    .officialNotice(sourceDetails.getOfficialNotice())
                    .build();
        }
        else {
            EmpNotificationReviewDecisionDetails sourceDetails = (EmpNotificationReviewDecisionDetails)sourceReviewDecision.getDetails();
            details = EmpNotificationReviewDecisionDetails.builder()
                    .officialNotice(sourceDetails.getOfficialNotice())
                    .build();
        }
        return EmpNotificationReviewDecision.builder()
                .details(details)
                .type(sourceReviewDecision.getType())
                .build();
    }

}
