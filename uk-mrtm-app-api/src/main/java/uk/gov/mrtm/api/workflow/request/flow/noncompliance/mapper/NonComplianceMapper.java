package uk.gov.mrtm.api.workflow.request.flow.noncompliance.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationClosedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceDecisionNotification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.workflow.request.application.taskview.RequestInfoDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface NonComplianceMapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "selectedRequests", source = "taskPayload", qualifiedByName = "selectedRequests")
    NonComplianceApplicationSubmittedRequestActionPayload toSubmittedRequestAction(
        NonComplianceApplicationSubmitRequestTaskPayload taskPayload, String payloadType);

    @Named("selectedRequests")
    default Set<RequestInfoDTO> selectedRequests(NonComplianceApplicationSubmitRequestTaskPayload requestTaskPayload) {
        
        return requestTaskPayload.getSelectedRequests().stream().map(req ->
                new RequestInfoDTO(
                    req,
                    requestTaskPayload.getAvailableRequests()
                        .stream()
                        .filter(info -> info.getId().equals(req))
                        .findFirst()
                        .map(RequestInfoDTO::getType)
                        .orElse(null)
                )
            ).collect(Collectors.toSet());
    }

    @Mapping(target = "comments", ignore = true)
    NonComplianceApplicationSubmittedRequestActionPayload toSubmittedRequestActionIgnoreComments(
        NonComplianceApplicationSubmittedRequestActionPayload actionPayload
    );

    @Mapping(target = "comments", ignore = true)
    NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload toNoticeOfIntentSubmittedRequestActionIgnoreComments(
        NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload actionPayload
    );

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "comments", source = "requestPayload.initialPenaltyComments")
    @Mapping(target = "sectionsCompleted", source = "requestPayload.initialPenaltySectionsCompleted")
    NonComplianceInitialPenaltyNoticeRequestTaskPayload toNonComplianceInitialPenaltyNoticeRequestTaskPayload(
        NonComplianceRequestPayload requestPayload,
        String payloadType
    );

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "comments", source = "requestPayload.noticeOfIntentComments")
    @Mapping(target = "sectionsCompleted", source = "requestPayload.noticeOfIntentSectionsCompleted")
    NonComplianceNoticeOfIntentRequestTaskPayload toNonComplianceNoticeOfIntentRequestTaskPayload(
        NonComplianceRequestPayload requestPayload,
        String payloadType
    );


    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "decisionNotification", source = "decisionNotification")
    @Mapping(target = "usersInfo", source = "usersInfo")
    @Mapping(target = "attachments", ignore = true)
    NonComplianceInitialPenaltyNoticeApplicationSubmittedRequestActionPayload toInitialPenaltyNoticeSubmittedRequestAction(
        NonComplianceInitialPenaltyNoticeRequestTaskPayload taskPayload,
        NonComplianceDecisionNotification decisionNotification,
        Map<String, RequestActionUserInfo> usersInfo,
        String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "decisionNotification", source = "decisionNotification")
    @Mapping(target = "usersInfo", source = "usersInfo")
    @Mapping(target = "attachments", ignore = true)
    NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload toNoticeOfIntentSubmittedRequestAction(
        NonComplianceNoticeOfIntentRequestTaskPayload taskPayload,
        NonComplianceDecisionNotification decisionNotification,
        Map<String, RequestActionUserInfo> usersInfo,
        String payloadType);

    @Mapping(target = "comments", ignore = true)
    NonComplianceInitialPenaltyNoticeApplicationSubmittedRequestActionPayload toInitialPenaltyNoticeSubmittedRequestActionIgnoreComments(
        NonComplianceInitialPenaltyNoticeApplicationSubmittedRequestActionPayload actionPayload
    );

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "sectionsCompleted", source = "requestPayload.civilPenaltySectionsCompleted")
    @Mapping(target = "penaltyAmount", source = "requestPayload.civilPenaltyAmount")
    @Mapping(target = "dueDate", source = "requestPayload.civilPenaltyDueDate")
    @Mapping(target = "comments", source = "requestPayload.civilPenaltyComments")
    NonComplianceCivilPenaltyRequestTaskPayload toNonComplianceCivilPenaltyRequestTaskPayload(
        NonComplianceRequestPayload requestPayload,
        String payloadType
    );

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "decisionNotification", source = "decisionNotification")
    @Mapping(target = "usersInfo", source = "usersInfo")
    @Mapping(target = "attachments", ignore = true)
    NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload toCivilPenaltySubmittedRequestAction(
        NonComplianceCivilPenaltyRequestTaskPayload taskPayload,
        NonComplianceDecisionNotification decisionNotification,
        Map<String, RequestActionUserInfo> usersInfo,
        String payloadType);

    @Mapping(target = "comments", ignore = true)
    NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload toCivilPenaltySubmittedRequestActionIgnoreComments(
        NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload actionPayload);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload toFinalDeterminationSubmittedRequestAction(
        NonComplianceFinalDeterminationRequestTaskPayload taskPayload,
        String payloadType);

    @Mapping(target = "finalDetermination.comments", ignore = true)
    NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload toFinalDeterminationSubmittedRequestActionIgnoreComments(
        NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload actionPayload);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    NonComplianceApplicationClosedRequestActionPayload toClosedRequestAction(NonComplianceRequestPayload requestPayload,
                                                                             String payloadType);

}
